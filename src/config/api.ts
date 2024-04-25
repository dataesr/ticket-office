const { VITE_SCANR_API_AUTHORIZATION } = import.meta.env;
export const postHeaders = {
  Authorization: `Basic ${VITE_SCANR_API_AUTHORIZATION}`,
  "Content-Type": "application/json",
};
