import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [
    vue(),
    {
      name: "admin-dev-redirect",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url === "/admin" || request.url?.startsWith("/admin/")) {
            response.statusCode = 302;
            response.setHeader("Location", `http://localhost:5174${request.url}`);
            response.end();
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3002,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3001",
      "/uploads": "http://localhost:3001",
    },
  },
});
