import type { Request, Response } from "express";
import type { Types } from "mongoose";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import User, { UserValidationSchema, type User as UserDoc } from "../models/User.js";
import Task, { TaskValidationSchema, type TaskStatus, type Task as TaskDoc } from "../models/Task.js";
import { requireAuth } from "./utils/requireAuth.js";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET not set");

type GraphQLContext = {
  req: Request;
  res: Response;
  userId?: string | null;
};

export default {
  Query: {
    /* USERS */
    user: requireAuth(async (_: unknown, { id }: { id: string }) => {
      return await User.findById(id);
    }),
    users: requireAuth(async (_: unknown) => {
      return await User.find({});
    }),
    /* TASKS */
    task: requireAuth(async (_: unknown, { id }: { id: string }) => {
      return await Task.findById(id);
    }),
    tasks: requireAuth(async (_: unknown) => {
      return await Task.find({});
    }),
  },

  Mutation: {
    logout: async (_: unknown, _args: unknown, context: GraphQLContext) => {
      context.res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });
      return true;
    },
    /* AUTH */
    registerUser: async (_: unknown, args: {
        name: string;
        email: string;
        password: string;
      }, context: GraphQLContext) => {
        // Validate input
      const parseResult = UserValidationSchema.safeParse(args);
      if (!parseResult.success) {
        throw new GraphQLError("Validation error", {
          extensions: { code: "BAD_USER_INPUT", error: parseResult.error }
        });
      }

      // Check for existing email
      const existingUser = await User.findOne({ email: parseResult.data.email });
      if (existingUser) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "CONFLICT" }
        });
      }
      // Create user
      const user = await User.create(parseResult.data);

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1d",
      });
      context.res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      const { password, ...userData } = user.toObject();
      return { token, user: userData };
    },

    loginUser: async (
      _: unknown,
      { email, password }: {email: string, password: string},
      context: GraphQLContext
    ) => {
      // Check for existing user
      const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
        throw new GraphQLError("Wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }
      // Check that password is correct
      const correctPassword = await existingUser.comparePassword(password);
      if (!correctPassword) {
        throw new GraphQLError("Wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const token = jwt.sign({ userId: existingUser._id }, jwtSecret, {
        expiresIn: "1d",
      });
      context.res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      const { password: _pw, ...userData } = existingUser.toObject();
      return { token, user: userData };
    },

    /* USERS */

    // update
    updateUser: requireAuth(async (
      _: unknown,
      {
        id,
        ...rest
      }: {
        id: string;
        name?: string;
        email?: string;
        password?: string;
      }
    ) => {
      const UserUpdateSchema = UserValidationSchema.partial();
      const parseResult = UserUpdateSchema.safeParse(rest);

      if (!parseResult.success) {
        throw new GraphQLError("Validation error", {
          extensions: { code: "BAD_USER_INPUT", error: parseResult.error }
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, parseResult.data, { new: true });
      if (!updatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id }
        });
      }

      return updatedUser;
    }),

    // delete
    deleteUser: requireAuth(async (_: unknown, { id }: { id: String }) => {
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id }
        });
      }
      return true;
    }),

    /* TASKS */

    // create
    addTask: requireAuth(async (
      _: unknown,
      args: {
        title: string;
        description?: string;
        assignedTo?: Types.ObjectId | string;
      }
    ) => {
      const parseResult = TaskValidationSchema.safeParse(args);

      if (!parseResult.success) {
        throw new GraphQLError("Validation error", {
          extensions: { code: "BAD_USER_INPUT", error: parseResult.error }
        });
      }

      try {
        return await Task.create(parseResult.data);
      } catch (error: any) {
        throw new GraphQLError("Failed to create task", {
          extensions: { code: "INTERNAL_SERVER_ERROR", error }
        });
      }
    }),

    // update
    updateTask: requireAuth(async (
      _: unknown,
      {
        id,
        ...rest
      }: {
        id: string;
        title?: string;
        description?: string;
        status?: TaskStatus;
        assignedTo?: Types.ObjectId | string;
      }
    ) => {
      const TaskUpdateSchema = TaskValidationSchema.partial();
      const parseResult = TaskUpdateSchema.safeParse(rest);

      if (!parseResult.success) {
        throw new GraphQLError("Validation error", {
          extensions: { code: "BAD_USER_INPUT", error: parseResult.error }
        });
      }
      
      const updatedTask = await Task.findByIdAndUpdate(id, parseResult.data, { new: true });

      if (!updatedTask) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id }
        });
      }

      return updatedTask;
    }),

    // delete
    deleteTask: requireAuth(async (_: unknown, { id }: { id: String }) => {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id }
        });
      }
      return true;
    }),
  },

  User: {
    id: (doc: UserDoc) => String(doc._id),
    createdAt: (doc: UserDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: UserDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
  },

  Task: {
    id: (doc: TaskDoc) => String(doc._id),
    createdAt: (doc: TaskDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: TaskDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
    user: async (doc: TaskDoc, _args: unknown) => await User.findById(doc.assignedTo)
  },
};
