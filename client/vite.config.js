import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  server: {
    open: true,
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
    target: "esnext",
  },
  plugins: [react(), visualizer({ filename: "build/stats.html", open: true })],
});
