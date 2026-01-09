import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../services/api/auth';
import { get } from '../services/api/http';

// PUBLIC_INTERFACE
/**
 * React auth context for storing the current session and exposing auth actions.
 * Implements:
 * - login/signup/logout wired to backend
 * - session persistence via localStorage
 * - bootstrap profile fetch on app load
 * - auto-logout on global 401 events from API client
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Hook to access the auth context.
 * @returns {{
 *  user: object|null,
 *  token: string|null,
 *  isAuthenticated: boolean,
 *  isBootstrapping: boolean,
 *  authError: string,
 *  login: Function,
 *  signup: Function,
 *  logout: Function,
 *  refreshProfile: Function
 * }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

async function fetchProfileSafe() {
  // Prefer /users/profile (gives full profile schema).
  try {
    return await get('/users/profile');
  } catch (e) {
    // Fallback: /auth/me if profile table isn't ready yet.
    try {
      return await authApi.getCurrentUser();
    } catch (e2) {
      throw e2;
    }
  }
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

  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token);
    else localStorage.removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  useEffect(() => {
    // Auto-logout on 401
    const handler = () => {
      setToken(null);
      setUser(null);
      setAuthError('Your session expired. Please log in again.');
    };
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      setIsBootstrapping(true);
      setAuthError('');
      try {
        const profile = await fetchProfileSafe();
        if (!cancelled) setUser(profile || null);
      } catch (e) {
        // If backend is down, keep existing local user to avoid hard failure.
        // If backend responds 401, API client will emit auth:unauthorized and clear state.
        if (!cancelled) {
          setAuthError(e?.message || 'Unable to verify session right now.');
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => {
    const isAuthenticated = Boolean(token);

    return {
      user,
      token,
      isAuthenticated,
      isBootstrapping,
      authError,

      // PUBLIC_INTERFACE
      /**
       * Performs login and stores token/user in context.
       * @param {string} email
       * @param {string} password
       * @returns {Promise<object>}
       */
      async login(email, password) {
        setAuthError('');
        const res = await authApi.login(email, password);

        const nextToken = res?.token || res?.access_token;
        if (nextToken) setToken(nextToken);

        // Prefer fetching profile after login so UI has the full profile schema.
        try {
          const profile = await fetchProfileSafe();
          if (profile) setUser(profile);
          else if (res?.user) setUser(res.user);
        } catch {
          if (res?.user) setUser(res.user);
        }

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
        setAuthError('');
        const res = await authApi.signup(email, password, name);

        const nextToken = res?.token || res?.access_token;
        if (nextToken) setToken(nextToken);

        try {
          const profile = await fetchProfileSafe();
          if (profile) setUser(profile);
          else if (res?.user) setUser(res.user);
        } catch {
          if (res?.user) setUser(res.user);
        }

        return res;
      },

      // PUBLIC_INTERFACE
      /**
       * Logs out (server best-effort) and clears local session.
       * @returns {Promise<void>}
       */
      async logout() {
        setAuthError('');
        try {
          await authApi.logout();
        } catch {
          // Ignore logout failures (backend may be down).
        } finally {
          setToken(null);
          setUser(null);
        }
      },

      // PUBLIC_INTERFACE
      /**
       * Refreshes current profile from backend.
       * @returns {Promise<object|null>}
       */
      async refreshProfile() {
        if (!token) return null;
        const profile = await fetchProfileSafe();
        setUser(profile || null);
        return profile;
      },
    };
  }, [token, user, isBootstrapping, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
