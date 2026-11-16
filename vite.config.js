import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiPort = process.env.PORT || env.PORT || 4000;

  return {
    plugins: [react()],
    server: {
      watch: {
        // The admin API writes this file at runtime. Watching it would reload
        // the page on every save and interrupt the live-update experience.
        ignored: [
          "**/data/portfolio.json",
          "**/data/portfolio.backup.json",
          "**/data/portfolio.json.tmp",
        ],
      },
      proxy: {
        "/api": {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
