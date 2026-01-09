import { post } from './client';
import { isStubMode } from './mode';

// PUBLIC_INTERFACE
/**
 * Authentication service with stub/real switching.
 *
 * - Default: stub mode (good for UI work while backend stabilizes).
 * - To switch to real API:
 *   - set env: REACT_APP_API_MODE=real
 *   - or set localStorage: api_mode=real
 *
 * If real mode is enabled but the backend is unreachable, calls will gracefully
 * fall back to stubbed behavior to keep the UI usable.
 */

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function mockUser(email, name) {
  return { id: cryptoSafeId(email), email, name: name || 'User' };
}

function cryptoSafeId(seed) {
  // Small deterministic-ish id (no dependency) for stubbed data.
  const s = String(seed || 'seed');
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}

async function withFallback(realFn, stubFn) {
  if (isStubMode()) return stubFn();
  try {
    return await realFn();
  } catch (e) {
    console.warn('Auth service: real API failed, falling back to stubs:', e);
    return stubFn();
  }
}

// PUBLIC_INTERFACE
/**
 * Login user with email and password.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and auth token
 */
export async function login(email, password) {
  return withFallback(
    () => post('/auth/login', { email, password }),
    async () => {
      console.log('Auth service (stub): login', { email });
      await sleep(800);
      return { user: mockUser(email, 'Test User'), token: 'mock-jwt-token' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Sign up new user.
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} User data and auth token
 */
export async function signup(email, password, name) {
  return withFallback(
    () => post('/auth/signup', { email, password, name }),
    async () => {
      console.log('Auth service (stub): signup', { email, name });
      await sleep(900);
      return { user: mockUser(email, name || 'New User'), token: 'mock-jwt-token' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Request password reset.
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export async function requestPasswordReset(email) {
  return withFallback(
    () => post('/auth/reset-password', { email }),
    async () => {
      console.log('Auth service (stub): requestPasswordReset', { email });
      await sleep(700);
      return { message: 'Password reset email sent successfully' };
    }
  );
}

// PUBLIC_INTERFACE
/**
 * Request magic link for passwordless login.
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export async function requestMagicLink(email) {
  return withFallback(
    // Placeholder endpoint name; adjust once backend is stable.
    () => post('/auth/magic-link', { email }),
    async () => {
      console.log('Auth service (stub): requestMagicLink', { email });
      await sleep(750);
      return { message: 'Magic link sent to your email' };
    }
  );
}

export default {
  login,
  signup,
  requestPasswordReset,
  requestMagicLink,
};
