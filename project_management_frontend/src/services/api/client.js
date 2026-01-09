import { del, get, post, put } from './http';

// PUBLIC_INTERFACE
/**
 * Clients API (CRUD) wired to backend.
 */

// PUBLIC_INTERFACE
/**
 * List clients.
 * @returns {Promise<Array>}
 */
export async function listClients() {
  return get('/clients');
}

// PUBLIC_INTERFACE
/**
 * Get client by id.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getClient(id) {
  return get(`/clients/${id}`);
}

// PUBLIC_INTERFACE
/**
 * Create client.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createClient(payload) {
  return post('/clients', payload);
}

// PUBLIC_INTERFACE
/**
 * Update client.
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateClient(id, payload) {
  return put(`/clients/${id}`, payload);
}

// PUBLIC_INTERFACE
/**
 * Delete client.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteClient(id) {
  return del(`/clients/${id}`);
}

export default {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
