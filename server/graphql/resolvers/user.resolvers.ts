import bcrypt from "bcryptjs";
import { excludePassword } from "../utils/sanitizeUser.js";
import User, { type Role, UserValidationSchema, type User as UserDoc } from "../../models/User.js";
import Task from "../../models/Task.js";
import { validateOrThrow, notFoundIfNull, badInputIf, badInputIfInvalidId } from "../utils/errorHandling.js";
import { paginateFind } from "../utils/pagination.js";

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

  /*
    GET MANY
  */
  async getMany(_: unknown, { page, limit, search }: { page?: number; limit?: number; search?: string }) {
    const match: any = {};
    if (search && search.trim()) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    return await paginateFind<UserDoc>(User.find(match).select("-password"), { page, limit });
  }

  /*
    GET BY ID
  */
  async getById(_: unknown, { id }: { id: string }) {
    badInputIfInvalidId(id, "Invalid user id", { userId: id }); // validate ID
    const user = await User.findById(id);
    notFoundIfNull(user, "User not found", { userId: id }); // error handling
    return excludePassword(user);
  }

  /*
    GET ME
  */
  async me(_: unknown, _args: unknown, context: { userId: string }) {
    const id = context.userId;
    badInputIfInvalidId(id, "Invalid user id", { userId: id }); // validate ID

    const user = await User.findById(context.userId);
    notFoundIfNull(user, "User not found", { userId: context.userId }); // error handling
    return excludePassword(user);
  }

  /*
    UPDATE
  */
  async update(_: unknown, { id, currentPassword, ...input }: UpdateInput, context: { userId: string; role?: string }) {
    badInputIfInvalidId(id, "Invalid user id", { userId: id }); // validate ID
    
    const UserUpdateSchema = UserValidationSchema.partial();
    const data = validateOrThrow(UserUpdateSchema, input);

    // Get the current user to compare values
    const user = await User.findById(id);
    notFoundIfNull(user, "User not found", { userId: id }); // error handling

    // Check if this is a self-update (user updating their own profile)
    const isSelfUpdate = context.userId === id;
    
    // Check if email or password are actually changing
    const emailChanged = input.email !== undefined && input.email !== user.email;
    const passwordChanged = input.password !== undefined && input.password.trim() !== "";
    
    // If user is updating their own email or password, require current password
    if (isSelfUpdate && (emailChanged || passwordChanged)) {
      badInputIf(!currentPassword, "Current password is required when changing email or password");
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      badInputIf(!isCurrentPasswordValid, "Current password is incorrect");
    }

    // Hash password if provided
    const updateData = data;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return excludePassword(updatedUser);
  } 
  
  /*
    UPDATE ROLE
  */
  async updateRole(_: unknown, { id, role }: { id: string, role: Role }) {
    badInputIfInvalidId(id, "Invalid user id", { userId: id }); // validate ID

    const updatedUser = await User.findByIdAndUpdate(id, { role }, {
      new: true,
    });

    notFoundIfNull(updatedUser, "User not found", { userId: id }); // error handling
    return updatedUser;
  }

  /*
    DELETE
  */
  async delete(_: unknown, { id }: { id: string }, context: { userId?: string; res?: any }) {
    badInputIfInvalidId(id, "Invalid user id", { userId: id }); // validate ID
    const user = await User.findById(id);
    notFoundIfNull(user, "User not found", { userId: id }); // error handling

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
  }
}

export const userResolvers = new Users();
export const userTypeResolvers = Users.typeResolvers;
