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
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          about: ["src/components/about/About.jsx"],
          admin: ["src/components/admin/AdminPanel.jsx"],
          auth: ["src/components/auth/Login.jsx"],
          battlepass: ["src/components/battlepass/BattlePass.jsx"],
          discord: ["src/components/discord/DiscordRedirect.jsx"],
          home: ["src/components/home/Home.jsx"],
          legal: ["src/components/legal/Rules.jsx"],
          member: ["src/components/member/Member.jsx"],
          nav: ["src/components/Nav/NavBar.jsx"],
          notifications: ["src/components/notifications/Notifications.jsx"],
          server: ["src/components/server/ServerListDisplay.jsx"],
          services: ["src/components/services/ServicesListDisplay.jsx"],
          settings: ["src/components/settings/GeneralSettings.jsx"],
          shop: ["src/components/shop/Shop.jsx"],
          stats: ["src/components/stats/Stats.jsx"],
          tickets: ["src/components/tickets/Tickets.jsx"],
          vote: ["src/components/vote/Votes.jsx"],
        },
      },
      plugins: [visualizer({ open: true })],
    },
  },
  plugins: [react()],
});
