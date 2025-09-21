import { GraphQLError } from "graphql";

export function requireAuth<TArgs, TResult>(
  resolver: (parent: any, args: TArgs, context: any, info: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any, info: any) => {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "UNAUTHENTICATED" }
      });
    }
    return resolver(parent, args, context, info);
  };
}

export function requireAdmin<TArgs, TResult>(
  resolver: (parent: any, args: TArgs, context: any, info: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any, info: any) => {
    if (!context.role || context.role !== "ADMIN") {
      throw new GraphQLError("You do not have permission to access this", {
        extensions: { code: "UNAUTHORIZED" }
      });
    }
    return resolver(parent, args, context, info);
  };
}
