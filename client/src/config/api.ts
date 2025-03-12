const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";
const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};
const url = import.meta.env.VITE_BASE_API_URL || "";

export const contributionUrl = isDevelopment
  ? "/api/contribute?max_results=2000"
  : `${url}/api/contribute?max_results=2000`;

export const contactUrl = isDevelopment
  ? "/api/contacts?max_results=2000"
  : `${url}/api/contacts?max_results=2000`;

export const productionUrl = isDevelopment
  ? "/api/production?max_results=2000"
  : `${url}/api/productions?max_results=2000`;

export const nameChangeUrl = isDevelopment
  ? "/api/update-user-data?max_results=2000"
  : `${url}/api/update-user-data?max_results=2000`;

export const removeUserUrl = isDevelopment
  ? "/api/remove-user?max_results=2000"
  : `${url}/api/remove-user?max_results=2000`;

export const variationsUrl = isDevelopment
  ? "/api/variations?max_results=2000"
  : `${url}/api/variations?max_results=2000`;
