import { GraphQLError, GraphQLSchema, defaultFieldResolver } from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// Owner access check directive - user must own the resource
export function ownerDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = "owner"
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const ownerDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      // No @owner directive, do not wrap
      if (!ownerDirective) return fieldConfig;

      const { field = "ownerId", arg = "id" } = ownerDirective;
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const resourceId = args[arg];
        
        if (!resourceId) {
          throw new GraphQLError("Resource ID required for ownership check", { 
            extensions: { code: "BAD_USER_INPUT" } 
          });
        }

        try {
          // Import the appropriate model based on the return type
          const returnType = info.returnType.toString().replace(/[!\[\]]/g, '');
          let resource: any;
          
          if (returnType === 'Project' || returnType === 'Boolean') {
            const { default: Project } = await import("../../models/Project.js");
            resource = await Project.findById(resourceId);
          } else if (returnType === 'Task') {
            const { default: Task } = await import("../../models/Task.js");
            resource = await Task.findById(resourceId);
          } else {
            throw new GraphQLError(`Unsupported resource type for ownership check: ${returnType}`);
          }
          
          if (!resource) {
            throw new GraphQLError("Resource not found", { 
              extensions: { code: "NOT_FOUND" } 
            });
          }

          const resourceOwnerId = resource[field];
          if (!resourceOwnerId || String(resourceOwnerId) !== context.userId) {
            throw new GraphQLError("Access denied: Only resource owners can perform this action", { 
              extensions: { code: "FORBIDDEN" } 
            });
          }

          return resolve.call(this, source, args, context, info);
        } catch (error) {
          if (error instanceof GraphQLError) {
            throw error;
          }
          console.error("Error in owner directive:", error);
          throw new GraphQLError("Error checking ownership", { 
            extensions: { code: "INTERNAL_SERVER_ERROR" } 
          });
        }
      };

      return fieldConfig;
    },
  });
}
