const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};

export const contributionUrl = `/api/contribute?max_results=2000`;
export const contactUrl = `/api/contacts?max_results=2000`;
export const productionUrl = `/api/productions?max_results=2000`;
export const nameChangeUrl = `/api/update-user-data?max_results=2000`;
export const removeUserUrl = `/api/remove-user?max_results=2000`;
export const variationsUrl = `/api/variations?max_results=2000`;
