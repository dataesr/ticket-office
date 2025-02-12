const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";
const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};
const url = import.meta.env.VITE_BASE_API_URL || "";

export const contributionUrl = isDevelopment
  ? "http://localhost:3000/api/contribute?max_results=2000"
  : `${url}/api/contribute?max_results=2000`;

export const contactUrl = isDevelopment
  ? "http://localhost:3000/api/contacts?max_results=2000"
  : `${url}/api/contacts?max_results=2000`;

export const productionUrl = isDevelopment
  ? "http://localhost:3000/api/production?max_results=2000"
  : `${url}/api/productionsmax_results=2000`;

export const nameChangeUrl = isDevelopment
  ? "http://localhost:3000/api/update-user-data?max_results=2000"
  : `${url}/api/update-user-datamax_results=2000`;

export const removeUserUrl = isDevelopment
  ? "http://localhost:3000/api/remove-user?max_results=2000"
  : `${url}/api/remove-usermax_results=2000"`;

export const bsoLocalVariations = isDevelopment
  ? "http://localhost:3000/api/variations?max_results=2000"
  : `${url}/api/variationsmax_results=2000"`;
