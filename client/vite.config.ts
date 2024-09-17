import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import visualizer from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), (visualizer as any).default() as PluginOption],
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
  resolve: {
    alias: {
      "@": path.resolve(__dirname + "/src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});