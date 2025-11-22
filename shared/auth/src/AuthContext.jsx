import React, { createContext, useState, useEffect, useContext } from 'react';
import { directus } from './directus'; // We will create this API client next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if the user is already authenticated
    const fetchUser = async () => {
      try {
        // This will succeed if the auth cookie is present and valid
        const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
        const userRes = await fetch(`${targetUrl}/users/me`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!userRes.ok) {
          throw new Error('Not authenticated');
        }

        const userJson = await userRes.json();
        setUser(userJson.data);
      } catch (error) {
        // Not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;

      // Perform login via raw fetch since SDK hangs
      const loginRes = await fetch(`${targetUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode: 'cookie' }),
      });

      const loginJson = await loginRes.json();
      const accessToken = loginJson.data?.access_token;
      
      // Give a small delay for cookie to be set (if working)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Use the token we just got, falling back to cookie if needed
      const headers = {
        'Content-Type': 'application/json',
      };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const userRes = await fetch(`${targetUrl}/users/me`, {
        headers,
        credentials: 'include',
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`Failed to fetch user: ${userRes.status} ${errorText}`);
      }

      const userJson = await userRes.json();
      const response = userJson.data;

      setUser(response);
    } catch (error) {
      console.error('Login process failed:', error);
      // Re-throw the error so that the calling component can handle it if necessary
      throw error;
    }
  };

  const logout = async () => {
    try {
      const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
      const res = await fetch(`${targetUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
      });
      
      if (!res.ok) {
        // If 400/401, it likely means the session was already invalid or missing (Token Fallback mode)
        console.warn(`Server logout returned ${res.status}. This is expected if cookies are blocked.`);
      }
    } catch (error) {
      console.error('Logout network request failed:', error);
    } finally {
      setUser(null);
    }
  };

  const auth = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role?.name === 'Admin', // Example of role check
    isPending: user?.status === 'pending',
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={auth}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};