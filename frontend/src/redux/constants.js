export const BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.MODE === "production" ? "" : "http://localhost:3005")).replace(/\/$/, "");
export const USERS_URL = "/api/users";
export const INCIDENTS_URL = "/api/incidents";
export const NOTIFICATIONS_URL = "/api/notifications";
export const REPORTS_URL = "/api/reports";
export const SOLUTIONS_URL = "/api/solutions";
export const ISSUES_URL = "/api/issues";
export const SERVICES_URL = "/api/services";
