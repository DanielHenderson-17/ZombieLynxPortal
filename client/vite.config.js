import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    open: true, // Automatically opens the browser on startup
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
  },
  plugins: [react()],
});
