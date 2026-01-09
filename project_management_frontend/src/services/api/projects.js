import { del, get, post, put } from './http';

// PUBLIC_INTERFACE
/**
 * List projects (backend returns all projects for user).
 * @returns {Promise<Array>}
 */
export async function listProjects() {
  return get('/projects');
}

// PUBLIC_INTERFACE
/**
 * Get project by id.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getProject(id) {
  return get(`/projects/${id}`);
}

// PUBLIC_INTERFACE
/**
 * Create project.
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createProject(payload) {
  return post('/projects', payload);
}

// PUBLIC_INTERFACE
/**
 * Update project.
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateProject(id, payload) {
  return put(`/projects/${id}`, payload);
}

// PUBLIC_INTERFACE
/**
 * Delete project.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteProject(id) {
  return del(`/projects/${id}`);
}

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
