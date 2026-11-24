import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "/admin/",
  plugins: [
    vue(),
    {
      name: "admin-root-redirect",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url === "/") {
            response.statusCode = 302;
            response.setHeader("Location", "/admin");
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
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:3001",
      "/uploads": "http://localhost:3001",
    },
  },
});
