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

  const addUser = async (userData) => {
    //console.log('Attempting to add user with data:', userData);
    try {
      const targetUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
      const token = localStorage.getItem('auth_token');

      const headers = {
        'Content-Type': 'application/json',
      };

      // If a token exists, this is an admin creating a user. Add the Authorization header.
      // If not, it's a public registration, and we don't send the header.
      if (token) {
        //console.log('Auth token found, sending as authenticated request.');
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log('No auth token found, sending as public registration request.');
      }

      const addUserRes = await fetch(`${targetUrl}/users`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(userData),
      });

      if (!addUserRes.ok) {
        const errorText = await addUserRes.text();
        console.error('Failed to add user. Status:', addUserRes.status, 'Response:', errorText);
        throw new Error(`Failed to add user: ${addUserRes.status} ${errorText}`);
      }

      // It's possible Directus returns 204 No Content on public registration
      if (addUserRes.status === 204) {
        console.log('User created successfully with 204 No Content response.');
        return {}; // Return an empty object to signify success without data
      }

      const newUserJson = await addUserRes.json();
      console.log('User added successfully:', newUserJson.data);
      return newUserJson.data;
    } catch (error) {
      console.error('Add user process failed:', error);
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
    addUser,
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