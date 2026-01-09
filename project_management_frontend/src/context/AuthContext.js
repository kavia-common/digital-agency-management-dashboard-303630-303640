import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../services/api/auth';

// PUBLIC_INTERFACE
/**
 * React auth context for storing the current session and exposing auth actions.
 * This is intentionally lightweight and ready to be connected to a real backend later.
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Hook to access the auth context.
 * @returns {{ user: object|null, token: string|null, isAuthenticated: boolean, login: Function, signup: Function, logout: Function }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

// PUBLIC_INTERFACE
/**
 * AuthProvider wraps the app to provide auth state and actions.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(token);

    return {
      user,
      token,
      isAuthenticated,
      // PUBLIC_INTERFACE
      /**
       * Performs login and stores token/user in context.
       * @param {string} email
       * @param {string} password
       * @returns {Promise<object>}
       */
      async login(email, password) {
        const res = await authApi.login(email, password);
        if (res?.token) setToken(res.token);
        if (res?.user) setUser(res.user);
        return res;
      },
      // PUBLIC_INTERFACE
      /**
       * Performs signup and stores token/user in context.
       * @param {string} email
       * @param {string} password
       * @param {string} name
       * @returns {Promise<object>}
       */
      async signup(email, password, name) {
        const res = await authApi.signup(email, password, name);
        if (res?.token) setToken(res.token);
        if (res?.user) setUser(res.user);
        return res;
      },
      // PUBLIC_INTERFACE
      /**
       * Clears the current session.
       * @returns {void}
       */
      logout() {
        setToken(null);
        setUser(null);
      },
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
