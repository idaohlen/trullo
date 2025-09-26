import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Admin role check directive
export function adminDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "admin"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const adminDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      // No @admin directive, do not wrap
      if (!adminDirective) return fieldConfig;

      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        if (context.role !== "ADMIN") {
          throw new GraphQLError("Admin access required", { 
            extensions: { code: "FORBIDDEN" } 
          });
        }

        return resolve.call(this, source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
