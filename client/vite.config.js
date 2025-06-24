import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  server: {
    open: true, // Automatically opens the browser on startup
    port: 5174, // 👈 Fixed port number
    strictPort: true, // 👈 Prevents Vite from switching to another port if 5176 is in use
    proxy: {
      "/api": {
        target: "https://localhost:5001", // 👈 Backend URL (matches Program.cs launch settings)
        changeOrigin: true,
        secure: false, // 👈 Allows self-signed SSL certificates in development
      },
    },
  },
  build: {
    outDir: "build", // Optional: Where the production build will be output
    rollupOptions: {
      plugins: [visualizer({ open: true })],
    },
  },
  plugins: [react()],
});
