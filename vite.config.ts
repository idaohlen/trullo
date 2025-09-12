import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { expressPlugin } from "./plugins/express-plugin";
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), expressPlugin(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@server": resolve(__dirname, "server"),
      "@rest": resolve(__dirname, "server/rest"),
      "@models": resolve(__dirname, "server/models"),
      "@graphql": resolve(__dirname, "server/graphql"),
    }
  }
});
