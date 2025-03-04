export const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development"
export const apiUrl = !isDevelopment ? import.meta.env.VITE_BASE_API_URL : "http://localhost:3000"
