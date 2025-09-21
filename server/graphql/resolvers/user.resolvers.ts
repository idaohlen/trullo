import { GraphQLError } from "graphql";
import { excludePassword } from "../utils/sanitizeUser.js";
import User, { type Role, UserValidationSchema, type User as UserDoc } from "../../models/User.js";

type UpdateInput = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
};

class Users {
  static typeResolvers = {
    id: (doc: UserDoc) => String(doc._id),
    createdAt: (doc: UserDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: UserDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };

  static roles = ["USER", "ADMIN"];
  
  async getRoles() {
    return Users.roles;
  }

  async getMany(_: unknown) {
    try {
      const users = await User.find();
      return users.map(excludePassword);
    } catch (error) {
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async getById(_: unknown, { id }: { id: string }) {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return excludePassword(user);
    } catch (error) {
      console.error("getById error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async me(_: unknown, _args: unknown, context: { userId: string }) {
    const user = await User.findById(context.userId);
    return excludePassword(user);
  }

  async update(_: unknown, { id, ...input }: UpdateInput) {
    const UserUpdateSchema = UserValidationSchema.partial();
    const parseResult = UserUpdateSchema.safeParse(input);

    if (!parseResult.success) {
      throw new GraphQLError("Validation error", {
        extensions: { code: "BAD_USER_INPUT", error: parseResult.error },
      });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, parseResult.data, {
        new: true,
      });

      if (!updatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id },
        });
      }

      return excludePassword(updatedUser);
    } catch (error) {
      console.error("update error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async updateRole(_: unknown, { id, role }: { id: String, role: Role }) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { role }, {
        new: true,
      });

      if (!updatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id },
        });
      }

      return updatedUser;
    } catch (error) {
      console.error("update error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async delete(_: unknown, { id }: { id: String }) {
    try {
      const deleted = await User.findByIdAndDelete(id);

      if (!deleted) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id },
        });
      }

      return true;
    } catch (error) {
      console.error("delete error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }
}

export const userResolvers = new Users();
export const userTypeResolvers = Users.typeResolvers;
