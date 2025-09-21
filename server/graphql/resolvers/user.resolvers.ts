import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import { excludePassword } from "../utils/sanitizeUser.js";
import User, { type Role, UserValidationSchema, type User as UserDoc } from "../../models/User.js";
import Task from "../../models/Task.js";

type UpdateInput = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
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

  async update(_: unknown, { id, currentPassword, ...input }: UpdateInput, context: { userId: string; role?: string }) {
    const UserUpdateSchema = UserValidationSchema.partial();
    const parseResult = UserUpdateSchema.safeParse(input);

    if (!parseResult.success) {
      throw new GraphQLError("Validation error", {
        extensions: { code: "BAD_USER_INPUT", error: parseResult.error },
      });
    }

    try {
      // Get the current user to compare values
      const user = await User.findById(id);
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if this is a self-update (user updating their own profile)
      const isSelfUpdate = context.userId === id;
      
      // Check if email or password are actually changing
      const emailChanged = input.email !== undefined && input.email !== user.email;
      const passwordChanged = input.password !== undefined && input.password.trim() !== "";
      
      // If user is updating their own email or password, require current password
      if (isSelfUpdate && (emailChanged || passwordChanged)) {
        if (!currentPassword) {
          throw new GraphQLError("Current password is required when changing email or password", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
          throw new GraphQLError("Current password is incorrect", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
      }

      // Hash password if provided
      const updateData = { ...parseResult.data };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        throw new GraphQLError("Failed to update user", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
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
  }  async updateRole(_: unknown, { id, role }: { id: String, role: Role }) {
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

  async delete(_: unknown, { id }: { id: String }, context: { userId?: string; res?: any }) {
    try {
      const user = await User.findById(id);

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id },
        });
      }

      // If the user is deleting their own account, clear the auth cookie (log out)
      const isSelfDelete = context.userId && context.userId === String(id);
      if (isSelfDelete && context.res) {
        context.res.cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
        });
      }

      await Task.updateMany({ assignedTo: id }, { assignedTo: null });
      await User.findByIdAndDelete(id);

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
