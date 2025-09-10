import type { Plugin, ViteDevServer } from "vite";
import express, { type Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import connectDB from "../server/db";
import schema from "../server/graphql/schema";
import resolvers from "../server/graphql/resolvers";

export function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    async configureServer(server: ViteDevServer) {
      await connectDB();
      const app: Express = express();

      const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers,
      });

      await apolloServer.start();

      // Add a simple welcome route for /api
      app.get("/api", (_req, res) => {
        res.json({ message: "Welcome to the API!" });
      });

      app.use("/api", express.json(), expressMiddleware(apolloServer));

      server.middlewares.use(app);
    },
  };
}
