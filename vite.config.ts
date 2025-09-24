import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { expressPlugin } from "./plugins/express-plugin";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), expressPlugin(), tailwindcss()],
  server: {
    port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 4000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
