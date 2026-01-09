// PUBLIC_INTERFACE
/**
 * Base API client for making HTTP requests
 * Reads API base URL from environment variable
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
/**
 * Makes an HTTP request to the API
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add authorization token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    // Some backends may return empty bodies or non-JSON on errors; parse defensively.
    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * Makes a GET request
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export async function get(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: 'GET' });
}

// PUBLIC_INTERFACE
/**
 * Makes a POST request
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export async function post(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUBLIC_INTERFACE
/**
 * Makes a PUT request
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
 */
export async function put(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// PUBLIC_INTERFACE
/**
 * Makes a DELETE request
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Response data
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
