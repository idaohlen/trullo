import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Self access check directive - user can only access their own resources
export function selfDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "self"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const selfDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      // No @self directive, do not wrap
      if (!selfDirective) return fieldConfig;

      const { arg = "id" } = selfDirective;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const resourceUserId = args[arg];
        
        if (!resourceUserId || context.userId !== resourceUserId) {
          throw new GraphQLError("Access denied: Can only access own resources", { 
            extensions: { code: "FORBIDDEN" } 
          });
        }

        return resolve.call(this, source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
