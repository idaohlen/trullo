import type { Plugin, ViteDevServer } from "vite";
import { createApp } from "../server/createApp.js";

export function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    async configureServer(server: ViteDevServer) {
      // Use the shared app factory
      const app = await createApp();
      server.middlewares.use(app);
    },
  };
}
