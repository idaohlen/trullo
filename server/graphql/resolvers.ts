import type { Types } from "mongoose";
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
      return User.create(args);
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
      return Task.findByIdAndUpdate(id, rest, { new: true });
    },

    // delete
    deleteTask: async (_: unknown, { id }: { id: String }) => {
      return !!(await Task.findByIdAndDelete(id));
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
    user: async (doc: TaskDoc, _args: unknown) => {
      return await User.findById(doc.assignedTo);
    }
  },
};
