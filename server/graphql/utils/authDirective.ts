import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Define auth requirements in schema instead of wrapping a resolver with middleware
export function authDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "auth"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      // No @auth directive, do not wrap
      if (!authDirective) return fieldConfig;

      const { role, allowSelf, selfArg } = authDirective;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        // If no specific role required, just check for authentication
        if (!role) {
          if (!context.userId) throw new GraphQLError("Authentication required", { extensions: { code: "UNAUTHENTICATED" } });
          return resolve.call(this, source, args, context, info);
        }
        
        const isAdmin = context.role === role;
        const isSelf =
          allowSelf &&
          context.userId &&
          args[selfArg || "id"] &&
          context.userId === args[selfArg || "id"];

        if (!isAdmin && !isSelf) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });

        return resolve.call(this, source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
