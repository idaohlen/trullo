import express, { type Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp(): Promise<Express> {
  // Connect to database
  await connectDB();
  
  const app: Express = express();

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: process.env.NODE_ENV !== "production",
    formatError: (err) => {
      if (process.env.NODE_ENV === "production") {
        console.error("GraphQL Error:", err);
        return new Error("Internal server error");
      }
      return err;
    },
  });

  await apolloServer.start();

  app.use(express.json());

  // GraphQL endpoint
  app.use("/api", expressMiddleware(apolloServer));

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    // Serve built frontend files
    app.use(express.static(path.join(__dirname, "../dist")));
    
    // Catch-all handler for SPA routing (must be last)
    app.use((_req, res) => {
      res.sendFile(path.join(__dirname, "../dist/index.html"));
    });
  }

  return app;
}
