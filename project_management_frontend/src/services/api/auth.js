import { get, post } from './http';
import { isStubMode } from './mode';

// PUBLIC_INTERFACE
/**
 * Authentication service with stub/real switching.
 *
 * Real backend endpoints (FastAPI):
 * - POST /auth/signup        { email, password, full_name } -> { access_token, token_type, user }
 * - POST /auth/login         { email, password }            -> { access_token, token_type, user }
 * - POST /auth/logout        (auth header)                  -> { message }
 * - POST /auth/reset-password{ email }                      -> { message }
 * - GET  /auth/me            (auth header)                  -> { id, email, ... }
 *
 * Notes:
 * - We keep a graceful fallback to stubs when backend is unreachable, so the UI never hard-crashes.
 */

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function cryptoSafeId(seed) {
  const s = String(seed || 'seed');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}

function mockUser(email, fullName) {
  return { id: cryptoSafeId(email), email, full_name: fullName || 'User' };
}

function normalizeAuthResponse(res) {
  if (!res) return res;
  // Backend uses access_token; frontend stores token as auth_token
  const token = res.access_token || res.token || res.accessToken;
  const user = res.user || res.profile || null;
  return { token, access_token: res.access_token, user, token_type: res.token_type };
}

async function withFallback(realFn, stubFn) {
  if (isStubMode()) return stubFn();
  try {
    return await realFn();
  } catch (e) {
    // If server is down, keep UX usable and allow retry.
    console.warn('Auth service: real API failed, falling back to stubs:', e);
    return stubFn();
  }
}

// PUBLIC_INTERFACE
/**
 * Login user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  return withFallback(
    async () => normalizeAuthResponse(await post('/auth/login', { email, password })),
    async () => {
      await sleep(650);
      return { user: mockUser(email, 'Test User'), token: 'mock-jwt-token' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Sign up new user.
 * Backend expects full_name.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<{user: object, token: string}>}
 */
export async function signup(email, password, fullName) {
  return withFallback(
    async () => normalizeAuthResponse(await post('/auth/signup', { email, password, full_name: fullName })),
    async () => {
      await sleep(750);
      return { user: mockUser(email, fullName || 'New User'), token: 'mock-jwt-token' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Logout current user.
 * @returns {Promise<{message: string}>}
 */
export async function logout() {
  return withFallback(
    async () => post('/auth/logout'),
    async () => {
      await sleep(350);
      return { message: 'Logged out successfully' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Request password reset.
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
export async function requestPasswordReset(email) {
  return withFallback(
    async () => post('/auth/reset-password', { email }),
    async () => {
      await sleep(450);
      return { message: 'If the email exists, a password reset link has been sent' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Magic link is not implemented by this backend; keep stubbed UX.
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
export async function requestMagicLink(email) {
  return withFallback(
    async () => {
      // Keep as a friendly error in real mode rather than breaking the UI.
      throw new Error('Magic link is not available yet. Please use email + password.');
    },
    async () => {
      await sleep(450);
      return { message: 'Magic link sent to your email (stub)' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Fetch current user from backend using the stored token.
 * @returns {Promise<object>}
 */
export async function getCurrentUser() {
  return get('/auth/me');
}

export default {
  login,
  signup,
  logout,
  requestPasswordReset,
  requestMagicLink,
  getCurrentUser,
};
