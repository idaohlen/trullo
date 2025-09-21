import { GraphQLError } from "graphql";

// Helper function to check authentication
function ensureAuthenticated(context: any): void {
  if (!context.userId) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }
}

// Helper function to check admin role
function ensureAdmin(context: any): void {
  if (!context.role || context.role !== "ADMIN") {
    throw new GraphQLError("You do not have permission to access this", {
      extensions: { code: "UNAUTHORIZED" }
    });
  }
}

export function requireAuth<TArgs, TResult>(
  resolver: (parent: any, args: TArgs, context: any, info: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any, info: any) => {
    ensureAuthenticated(context);
    return resolver(parent, args, context, info);
  };
}

export function requireAdmin<TArgs, TResult>(
  resolver: (parent: any, args: TArgs, context: any, info: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any, info: any) => {
    ensureAuthenticated(context);
    ensureAdmin(context);
    return resolver(parent, args, context, info);
  };
}

export function requireSelfOrAdmin<TArgs extends { id: string }, TResult>(
  resolver: (parent: any, args: TArgs, context: any, info: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any, info: any) => {
    ensureAuthenticated(context);
    
    const isSelfUpdate = context.userId === args.id;
    const isAdmin = context.role === "ADMIN";
    
    if (!isSelfUpdate && !isAdmin) {
      throw new GraphQLError("You can only update your own profile unless you are an admin", {
        extensions: { code: "UNAUTHORIZED" }
      });
    }
    
    return resolver(parent, args, context, info);
  };
}
