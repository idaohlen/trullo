import type { Types } from "mongoose";
import { GraphQLError } from "graphql";
import User, { type User as UserDoc } from "../models/User.js";
import Task, { type TaskStatus, type Task as TaskDoc } from "../models/Task.js";

export default {
  Query: {
    /* USERS */
    user: async (_: unknown, { id }: { id: string }) => {
      return await User.findById(id);
    },
    users: async (_: unknown) => {
      return await User.find({});
    },
    /* TASKS */
    task: async (_: unknown, { id }: { id: string }) => {
      return await Task.findById(id);
    },
    tasks: async (_: unknown) => {
      return await Task.find({});
    },
  },

  Mutation: {
    /* USERS */

    // create
    addUser: async (
      _: unknown,
      args: {
        name: string;
        email: string;
        password: string;
      }
    ) => {
      try {
        return await User.create(args);
      } catch (error: any) {
        if (error.code === 11000) {
          throw new GraphQLError("Email already exists", {
            extensions: { code: "CONFLICT" }
          });
        }

        throw new GraphQLError("Failed to create user", {
          extensions: { code: "BAD_USER_INPUT", error }
        });
      }
    },

    // update
    updateUser: async (
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
      const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });

      if (!updatedUser) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id }
        });
      }
      return updatedUser;
    },

    // delete
    deleteUser: async (_: unknown, { id }: { id: String }) => {
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND", userId: id }
        });
      }
      return true;
    },

    /* TASKS */

    // create
    addTask: async (
      _: unknown,
      args: {
        title: string;
        description?: string;
        assignedTo?: Types.ObjectId | string;
      }
    ) => {
      try {
        return await Task.create(args);
      } catch (error: any) {
        throw new GraphQLError("Failed to create task", {
          extensions: { code: "BAD_USER_INPUT", error }
        });
      }
    },

    // update
    updateTask: async (
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
      const updatedTask = await Task.findByIdAndUpdate(id, rest, { new: true });

      if (!updatedTask) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id }
        });
      }
      return updatedTask;
    },

    // delete
    deleteTask: async (_: unknown, { id }: { id: String }) => {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id }
        });
      }
      return true;
    },
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
