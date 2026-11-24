const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";

export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};

export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};
