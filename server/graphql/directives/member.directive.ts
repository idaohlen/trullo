import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Member access check directive - user must be a member or owner of the project
export function memberDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "member"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const memberDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      // No @member directive, do not wrap
      if (!memberDirective) return fieldConfig;

      const { arg = "id" } = memberDirective;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const projectId = args[arg] || args.projectId;
        
        if (!projectId) {
          throw new GraphQLError("Project ID required for member check", { 
            extensions: { code: "BAD_USER_INPUT" } 
          });
        }

        try {
          const { default: Project } = await import("../../models/Project.js");
          const project = await Project.findById(projectId) as any;
          
          if (!project) {
            throw new GraphQLError("Project not found", { 
              extensions: { code: "NOT_FOUND" } 
            });
          }

          const isOwner = String(project.ownerId) === context.userId;
          const isMember = project.members && project.members.some((memberId: any) => 
            String(memberId) === context.userId
          );

          if (!isOwner && !isMember) {
            throw new GraphQLError("Access denied: Only project members can access this resource", { 
              extensions: { code: "FORBIDDEN" } 
            });
          }

          return resolve.call(this, source, args, context, info);
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          console.error("Error in member directive:", error);
          throw new GraphQLError("Error checking membership", { 
            extensions: { code: "INTERNAL_SERVER_ERROR" } 
          });
        }
      };

      return fieldConfig;
    },
  });
}
