const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION;
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = { ...headers, "Content-Type": "application/json" };

const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const contributionUrl = isDevelopment
  ? "https://scanr-api.dataesr.ovh/contribute?max_results=2000"
  : "/api/contribute?max_results=2000";

export const contactUrl = isDevelopment
  ? "https://scanr-api.dataesr.ovh/contact?max_results=2000"
  : "/api/contact?max_results=2000";

export const productionUrl = isDevelopment
  ? "https://scanr-api.dataesr.ovh/contribute_productions?max_results=2000"
  : "/api/contribute_productions?max_results=2000";
