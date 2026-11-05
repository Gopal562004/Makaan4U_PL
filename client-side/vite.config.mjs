import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
    proxy: {
      "/js/app-h.js": {
        target: "https://lognexis-node.onrender.com",
        changeOrigin: true,
        rewrite: () => "/core.js",
      },
      "/api/sync/gif": {
        target: "https://lognexis-node.onrender.com",
        changeOrigin: true,
        rewrite: () => "/api/v1/m/p",
      },
      "/api/sync": {
        target: "https://lognexis-node.onrender.com",
        changeOrigin: true,
        rewrite: () => "/api/v1/m/e",
      },
    },
  },
});
