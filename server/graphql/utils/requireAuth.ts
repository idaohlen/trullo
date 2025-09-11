import { GraphQLError } from "graphql";

export function requireAuth<TArgs, TResult>(
  resolver: (parent: any, args: TArgs, context: any) => Promise<TResult>
) {
  return async (parent: any, args: TArgs, context: any) => {
    if (!context.userId) {
      throw new GraphQLError("Authentication required", {
        extensions: { code: "UNAUTHENTICATED" }
      });
    }
    return resolver(parent, args, context);
  };
}
