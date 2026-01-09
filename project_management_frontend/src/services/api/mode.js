// PUBLIC_INTERFACE
/**
 * Returns whether the frontend should use stubbed API calls.
 * Priority:
 * 1) localStorage override: api_mode = 'stub' | 'real'
 * 2) env default: REACT_APP_API_MODE = 'stub' | 'real' (defaults to 'stub')
 * @returns {boolean}
 */
export function isStubMode() {
  const ls = typeof window !== 'undefined' ? window.localStorage.getItem('api_mode') : null;
  const env = process.env.REACT_APP_API_MODE;
  const mode = (ls || env || 'stub').toLowerCase();
  return mode !== 'real';
}

// PUBLIC_INTERFACE
/**
 * Sets the API mode override in localStorage.
 * @param {'stub'|'real'} mode
 * @returns {void}
 */
export function setApiMode(mode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('api_mode', String(mode).toLowerCase());
}

// PUBLIC_INTERFACE
/**
 * Gets a human-friendly label for current API mode (used in UI).
 * @returns {string}
 */
export function getApiModeLabel() {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
  return isStubMode() ? 'API: Stubbed (set api_mode=real to use backend)' : `API: Live (${baseUrl})`;
}
