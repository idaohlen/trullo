import type { Types } from "mongoose";
import User from "../models/User.js";
import Task from "../models/Task.js";

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
      return User.create(args);
    },

    // update
    updateUser: async (
      _: unknown,
      { id, ...rest }: {
        id: string;
        name?: string;
        email?: string;
        password?: string;
      }
    ) => {
      return User.findByIdAndUpdate(id, rest, { new: true });
    },

    // delete
    deleteUser: async (_: unknown, { id }: { id: String }) => {
      return !!(await User.findByIdAndDelete(id));
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
      return Task.create(args);
    },

    // update
    updateTask: async (
      _: unknown,
      { id, ...rest }: {
        id: string;
        title?: string;
        description?: string;
        assignedTo?: Types.ObjectId | string;
      }
    ) => {
      return Task.findByIdAndUpdate(id, rest, { new: true });
    },

    // delete
    deleteTask: async (_: unknown, { id }: { id: String }) => {
      return !!(await Task.findByIdAndDelete(id));
    },
  },
};
