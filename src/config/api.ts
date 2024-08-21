const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION;
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = { ...headers, "Content-Type": "application/json" };

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const contributionUrl = isDevelopment
  ? "http://localhost:3000/contribution"
  : "/api/contribution?max_results=2000";

export const contactUrl = isDevelopment
  ? "http://localhost:3000/contact"
  : "/api/contact?max_results=2000";

export const productionUrl = isDevelopment
  ? "http://localhost:3000/production"
  : "/api/contribute_productions?max_results=2000";
