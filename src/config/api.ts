const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION;
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = { ...headers, "Content-Type": "application/json" };

export const contributionUrl = "/api/contribute?max_results=2000";
// export const contributionUrl =
//   "https://scanr-api.dataesr.ovh/contribute?max_results=2000";
export const contactUrl = "/api/contact?max_results=2000";
// export const contactUrl =
//   "https://scanr-api.dataesr.ovh/contact?max_results=2000";
