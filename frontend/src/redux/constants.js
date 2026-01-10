export const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "production" ? "" : "http://localhost:5001");
export const USERS_URL = `${BASE_URL}/api/users`;
export const INCIDENTS_URL = `${BASE_URL}/api/incidents`;
export const NOTIFICATIONS_URL = `${BASE_URL}/api/notifications`;
export const REPORTS_URL = `${BASE_URL}/api/reports`;
export const SOLUTIONS_URL = `${BASE_URL}/api/solutions`;
export const ISSUES_URL = `${BASE_URL}/api/issues`;
export const SERVICES_URL = `${BASE_URL}/api/services`;
