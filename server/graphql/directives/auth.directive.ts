import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Auth directive - handles authentication and optional role/self checks
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
        if (!context.userId) {
          throw new GraphQLError("Authentication required", { 
            extensions: { code: "UNAUTHENTICATED" } 
          });
        }

        // If no specific requirements, just check authentication (done above)
        if (!role && !allowSelf) {
          return resolve.call(this, source, args, context, info);
        }

        const isAdmin = role && context.role === role;
        const isSelf = allowSelf && 
          context.userId && 
          args[selfArg || "id"] && 
          context.userId === args[selfArg || "id"];

        // For combined role + allowSelf, allow if either condition is met (OR logic)
        if (role && allowSelf) {
          if (!isAdmin && !isSelf) {
            throw new GraphQLError("Access denied", { 
              extensions: { code: "FORBIDDEN" } 
            });
          }
        } else if (role && !isAdmin) {
          throw new GraphQLError("Insufficient privileges", { 
            extensions: { code: "FORBIDDEN" } 
          });
        } else if (allowSelf && !isSelf) {
          throw new GraphQLError("Can only access own resources", { 
            extensions: { code: "FORBIDDEN" } 
          });
        }

        return resolve.call(this, source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
