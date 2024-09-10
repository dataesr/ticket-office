const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION;
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = { ...headers, "Content-Type": "application/json" };

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const contributionUrl = isDevelopment
  ? "http://localhost:3000/api/contribute?max_results=2000"
  : "https://ticket-office-api.staging/api/contribute?max_results=2000";

export const contactUrl = isDevelopment
  ? "http://localhost:3000/api/contact?max_results=2000"
  : "https://ticket-office-api.staging/api/contact?max_results=2000";

export const productionUrl = isDevelopment
  ? "http://localhost:3000/api/production?max_results=2000"
  : "https://ticket-office-api.staging/api/productionsmax_results=2000";
