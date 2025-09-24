import { mapSchema, MapperKind } from "@graphql-tools/utils";
import { GraphQLSchema, defaultFieldResolver, type GraphQLFieldResolver } from "graphql";
import { withErrorHandling } from "./errorHandling.js";
import type { AsyncResolver, Middleware } from "../types";

// Helper function to help add multiple middleware functions to a resolver
// Example usage:
// someResolver: compose(requireAuth, requireAdmin, logAccess)(actualResolver),
export function compose(
  ...middlewares: Middleware[]
): (resolver: AsyncResolver) => AsyncResolver {
  return (resolver: AsyncResolver) =>
    middlewares.reduceRight((next, mw) => mw(next), resolver);
}

// Wrap all resolvers with catch-all error handling (500 interal server error)
export function wrapAllResolversWithErrorHandling(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const originalResolve = fieldConfig.resolve as GraphQLFieldResolver<any, any> | undefined;
      // Wrap the original resolver so it always returns a Promise (to match AsyncResolver)
      const asyncResolver: AsyncResolver = async (parent, args, context, info) => {
        return await Promise.resolve((originalResolve ?? defaultFieldResolver)(parent, args, context, info));
      };
      fieldConfig.resolve = withErrorHandling(asyncResolver);
      return fieldConfig;
    },
  });
}
