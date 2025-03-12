import { apiUrl } from "../api/utils/url";

const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};

export const contributionUrl = `${apiUrl}/contribute?max_results=2000`;
export const contactUrl = `${apiUrl}/contacts?max_results=2000`;
export const productionUrl = `${apiUrl}/productions?max_results=2000`;
export const nameChangeUrl = `${apiUrl}/update-user-data?max_results=2000`;
export const removeUserUrl = `${apiUrl}/remove-user?max_results=2000`;
export const variationsUrl = `${apiUrl}/variations?max_results=2000`;
