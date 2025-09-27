import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

export function memberOrAdminDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "memberOrAdmin"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (!directive) return fieldConfig;
      const { arg = "id" } = directive;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const projectId = args[arg] || args.projectId;
        if (!projectId) throw new GraphQLError("Project ID required", { extensions: { code: "BAD_USER_INPUT" } });

        // Admins always allowed
        if (context.role === "ADMIN") {
          return resolve.call(this, source, args, context, info);
        }

        // Check membership
        const { default: Project } = await import("../../models/Project.js");
        const project = await Project.findById(projectId);
        if (!project) throw new GraphQLError("Project not found", { extensions: { code: "NOT_FOUND" } });

        const isOwner = String(project.ownerId) === context.userId;
        const isMember = project.members && project.members.some((memberId: any) => String(memberId) === context.userId);

        if (!isOwner && !isMember) {
          throw new GraphQLError("Access denied: Only project members or admins can access this resource", { extensions: { code: "FORBIDDEN" } });
        }

        return resolve.call(this, source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
