const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION;
const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};

export const contributionUrl = isDevelopment
  ? "http://localhost:3000/api/contribute?max_results=2000"
  : "https://ticket-office-api.staging.dataesr.ovh/api/contribute?max_results=2000";

export const contactUrl = isDevelopment
  ? "http://localhost:3000/api/contact?max_results=2000"
  : "https://ticket-office-api.staging.dataesr.ovh/api/contact?max_results=2000";

export const productionUrl = isDevelopment
  ? "http://localhost:3000/api/production?max_results=2000"
  : "https://ticket-office-api.staging.dataesr.ovh/api/productionsmax_results=2000";

export const nameChangeUrl = isDevelopment
  ? "http://localhost:3000/api/update-user-data?max_results=2000"
  : "https://ticket-office-api.staging.dataesr.ovh/api/update-user-datamax_results=2000";

export const removeUserUrl = isDevelopment
  ? "http://localhost:3000/api/remove-user?max_results=2000"
  : "https://ticket-office-api.staging.dataesr.ovh/api/remove-usermax_results=2000";
