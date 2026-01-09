import { post } from './client';

// PUBLIC_INTERFACE
/**
 * Authentication service
 * Contains stub methods for login, signup, and password reset
 * These will be wired to actual backend endpoints later
 */

// PUBLIC_INTERFACE
/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and auth token
 */
export async function login(email, password) {
  // Stub implementation - replace with actual API call
  console.log('Auth service: login called with', { email });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Replace with actual API call
  // return post('/auth/login', { email, password });
  
  // Mock response for now
  return {
    user: { id: '1', email, name: 'Test User' },
    token: 'mock-jwt-token',
  };
}

// PUBLIC_INTERFACE
/**
 * Sign up new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name (optional)
 * @returns {Promise<Object>} User data and auth token
 */
export async function signup(email, password, name) {
  // Stub implementation - replace with actual API call
  console.log('Auth service: signup called with', { email, name });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Replace with actual API call
  // return post('/auth/signup', { email, password, name });
  
  // Mock response for now
  return {
    user: { id: '2', email, name: name || 'New User' },
    token: 'mock-jwt-token',
  };
}

// PUBLIC_INTERFACE
/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export async function requestPasswordReset(email) {
  // Stub implementation - replace with actual API call
  console.log('Auth service: requestPasswordReset called with', { email });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Replace with actual API call
  // return post('/auth/reset-password', { email });
  
  // Mock response for now
  return {
    message: 'Password reset email sent successfully',
  };
}

// PUBLIC_INTERFACE
/**
 * Request magic link for passwordless login
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export async function requestMagicLink(email) {
  // Stub implementation - replace with actual API call (Supabase)
  console.log('Auth service: requestMagicLink called with', { email });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Wire to Supabase magic link
  
  // Mock response for now
  return {
    message: 'Magic link sent to your email',
  };
}

export default {
  login,
  signup,
  requestPasswordReset,
  requestMagicLink,
};
