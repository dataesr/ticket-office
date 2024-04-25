import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const env = loadEnv(process.env.MODE, process.cwd());

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "http://0.0.0.0:5173",
    },
  },
  define: {
    VITE_SCANR_API_AUTHORIZATION: JSON.stringify(
      env.VITE_SCANR_API_AUTHORIZATION
    ),
  },
});
