import React, { createContext, useState, useEffect, useContext } from 'react';
import { directus } from './directus'; // We will create this API client next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No auth token found');
        }

        const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
        const userRes = await fetch(`${targetUrl}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!userRes.ok) {
          throw new Error('Not authenticated');
        }

        const userJson = await userRes.json();
        setUser(userJson.data);
      } catch (error) {
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;

      const loginRes = await fetch(`${targetUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const errorText = await loginRes.text();
        throw new Error(`Login failed: ${loginRes.status} ${errorText}`);
      }

      const loginJson = await loginRes.json();
      const accessToken = loginJson.data?.access_token;

      if (!accessToken) {
        throw new Error('No access token received');
      }

      localStorage.setItem('auth_token', accessToken);

      const userRes = await fetch(`${targetUrl}/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        throw new Error(`Failed to fetch user: ${userRes.status} ${errorText}`);
      }

      const userJson = await userRes.json();
      setUser(userJson.data);
    } catch (error) {
      console.error('Login process failed:', error);
      localStorage.removeItem('auth_token');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
      const token = localStorage.getItem('auth_token');

      const res = await fetch(`${targetUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token })
      });
      
      if (!res.ok) {
        console.warn(`Server logout returned ${res.status}. This may be expected.`);
      }
    } catch (error) {
      console.error('Logout network request failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
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