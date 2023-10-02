import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  plugins: [react(), VitePWA()],
  server: {
    port: 4444,
    host: "192.168.0.169",
  },
});
