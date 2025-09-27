import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

export function ownerOrAdminDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "ownerOrAdmin"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (!directive) return fieldConfig;
      const { field = "ownerId", arg = "id" } = directive;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const resourceId = args[arg];
        if (!resourceId) throw new GraphQLError("Resource ID required", { extensions: { code: "BAD_USER_INPUT" } });

        // Import model and get resource
        const { default: Project } = await import("../../models/Project.js");
        const resource = await Project.findById(resourceId);
        if (!resource) throw new GraphQLError("Resource not found", { extensions: { code: "NOT_FOUND" } });

        const isOwner = String(resource[field]) === context.userId;
        const isAdmin = context.role === "ADMIN";
        if (!isOwner && !isAdmin) {
          throw new GraphQLError("Access denied: Only owners or admins can perform this action", { extensions: { code: "FORBIDDEN" } });
        }
        return resolve.call(this, source, args, context, info);
      };
      return fieldConfig;
    },
  });
}
