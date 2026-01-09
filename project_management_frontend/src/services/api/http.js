// PUBLIC_INTERFACE
/**
 * Base HTTP API client for making requests to the backend.
 *
 * - Base URL resolution:
 *   1) REACT_APP_API_BASE_URL (preferred)
 *   2) REACT_APP_BACKEND_URL (supported by container env)
 *   3) fallback http://localhost:3001
 *
 * - Automatically injects Authorization: Bearer <token> when available
 * - Robust JSON parsing (handles empty / non-JSON responses)
 * - Emits a global "auth:unauthorized" event on 401 to allow auto-logout
 */

const DEFAULT_BASE = 'http://localhost:3001';

function getApiBaseUrl() {
  return (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    DEFAULT_BASE
  );
}

function buildUrl(endpoint) {
  const base = String(getApiBaseUrl()).replace(/\/+$/, '');
  const path = String(endpoint || '').startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

async function safeReadBody(response) {
  const contentType = response.headers.get('content-type') || '';
  if (response.status === 204) return null;

  try {
    if (contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }
    const text = await response.text();
    return text ? { message: text } : null;
  } catch {
    return { message: 'Unable to parse server response' };
  }
}

function emitUnauthorized() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

// PUBLIC_INTERFACE
/**
 * Makes an HTTP request to the API.
 * @param {string} endpoint - API endpoint path
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = buildUrl(endpoint);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await safeReadBody(response);

    if (!response.ok) {
      if (response.status === 401) emitUnauthorized();

      const message =
        data?.detail ||
        data?.message ||
        `Request failed (HTTP ${response.status})`;

      const err = new Error(message);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error?.name === 'TypeError' && String(error?.message || '').includes('fetch')) {
      const friendly = new Error(
        'Unable to reach the server. Please check your connection and try again.'
      );
      friendly.cause = error;
      throw friendly;
    }
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * GET request.
 * @param {string} endpoint
 * @param {RequestInit} options
 */
export async function get(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: 'GET' });
}

// PUBLIC_INTERFACE
/**
 * POST request.
 * @param {string} endpoint
 * @param {any} data
 * @param {RequestInit} options
 */
export async function post(endpoint, data, options = {}) {
  const body = data === undefined ? undefined : JSON.stringify(data);
  return apiRequest(endpoint, { ...options, method: 'POST', body });
}

// PUBLIC_INTERFACE
/**
 * PUT request.
 * @param {string} endpoint
 * @param {any} data
 * @param {RequestInit} options
 */
export async function put(endpoint, data, options = {}) {
  const body = data === undefined ? undefined : JSON.stringify(data);
  return apiRequest(endpoint, { ...options, method: 'PUT', body });
}

// PUBLIC_INTERFACE
/**
 * DELETE request.
 * @param {string} endpoint
 * @param {RequestInit} options
 */
export async function del(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
}

export default {
  get,
  post,
  put,
  delete: del,
};
