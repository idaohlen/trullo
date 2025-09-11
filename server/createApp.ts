import express, { type Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import schema from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import restAPI from "./REST";

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

  // REST endpoint
  app.use("/api", restAPI);

  // GraphQL endpoint
  app.use("/graphql", expressMiddleware(apolloServer, {
    context: async ({ req }: { req: express.Request }) => {
      const authHeader = req.headers.authorization;
      let userId: string | null = null;
      const jwtSecret = process.env.JWT_SECRET;
      if (authHeader && jwtSecret) {
        const token = authHeader.split("")[1];
        try {
          const payload = jwt.verify(token, jwtSecret);
          if (typeof payload === "object" && "userId" in payload) {
            userId = (payload as jwt.JwtPayload & { userId: string }).userId;
          }
        } catch {}
      }

      return { userId }
    },
  }));

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
