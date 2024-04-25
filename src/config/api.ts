const { VITE_SCANR_API_AUTHORIZATION: API_KEY } = import.meta.env;
export const postHeaders = {
  Authorization: `Basic ${API_KEY}`,
  "Content-Type": "application/json",
};
