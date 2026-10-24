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
        // In development we talk to the API over HTTP, not HTTPS.
        // For production builds this proxy is not used; frontend will call the real API URL.
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
    target: "esnext",
  },
  plugins: [
    react(),
    ...(process.env.ANALYZE === "true"
      ? [visualizer({ filename: "build/stats.html", open: false })]
      : []),
  ],
});

