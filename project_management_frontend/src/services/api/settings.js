import { get, put } from './http';

// PUBLIC_INTERFACE
/**
 * Fetch user settings.
 * Endpoint: GET /settings
 * @returns {Promise<Object>}
 */
export async function getSettings() {
  return get('/settings');
}

// PUBLIC_INTERFACE
/**
 * Update theme preference.
 * Endpoint: PUT /settings/theme
 * @param {'light'|'dark'} theme
 * @returns {Promise<Object>}
 */
export async function updateTheme(theme) {
  return put('/settings/theme', { theme });
}

// PUBLIC_INTERFACE
/**
 * Export user data.
 * Endpoint: GET /settings/export
 * @returns {Promise<{message: string, data: Object}>}
 */
export async function exportData() {
  return get('/settings/export');
}

export default { getSettings, updateTheme, exportData };
