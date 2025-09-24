import express, { type Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirectiveTransformer } from "./graphql/utils/authDirective.js";
import { wrapAllResolversWithErrorHandling } from "./graphql/utils/resolverUtils.js";
import connectDB from "./db.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import restAPI from "./rest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp(): Promise<Express> {
  // Connect to database
  await connectDB();

  const app: Express = express();

  let schema = makeExecutableSchema({ typeDefs, resolvers });
  schema = authDirectiveTransformer(schema, "auth");
  schema = wrapAllResolversWithErrorHandling(schema);

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== "production",
    formatError: (err) => {
      // Hide error details from the client in production
      if (process.env.NODE_ENV === "production") {
        console.error("GraphQL Error:", err);
        return new Error("Internal server error");
      }
      return err;
    },
  });

  await apolloServer.start();

  app.use(express.json());
  app.use(cookieParser());

  // REST endpoint
  app.use("/api", restAPI);

  // GraphQL endpoint
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        let userId: string | null = null;
        let role: string | null = null;
        const jwtSecret = process.env.JWT_SECRET;
        const token = req.cookies?.token;
        if (token && jwtSecret) {
          try {
            const payload = jwt.verify(token, jwtSecret);
            if (typeof payload === "object" && "userId" in payload) {
              const jwtPayload = payload as jwt.JwtPayload & {
                userId: string;
                role?: string;
              };
              userId = jwtPayload.userId;
              role = jwtPayload.role || null;
            }
          } catch {}
        }
        return { userId, role, req, res };
      },
    })
  );

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
