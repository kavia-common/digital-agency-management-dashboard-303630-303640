import { get } from './http';

// PUBLIC_INTERFACE
/**
 * Fetch dashboard stats from backend.
 * Endpoint: GET /dashboard/stats
 * @returns {Promise<{total_projects:number, active_projects:number, completed_projects:number, total_clients:number, total_revenue:number, recent_projects:Array}>}
 */
export async function getDashboardStats() {
  return get('/dashboard/stats');
}

export default { getDashboardStats };
