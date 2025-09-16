import type { Types } from "mongoose";
import { GraphQLError } from "graphql";
import Task, {
  TaskValidationSchema,
  type TaskStatus,
  type Task as TaskDoc
} from "../../models/Task.js";
import User from "../../models/User.js";
import { excludePassword } from "../utils/sanitizeUser.js";

type CreateInput = {
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId | string;
};

type UpdateInput = {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: Types.ObjectId | string;
};

class Tasks {
  static typeResolvers = {
    id: (doc: TaskDoc) => String(doc._id),
    createdAt: (doc: TaskDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: TaskDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
    user: async (doc: TaskDoc, _args: unknown) => {
      const user = await User.findById(doc.assignedTo);
      return user ? excludePassword(user) : null;
    }
  };

  static statusValues = ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"];
  
  async getStatusValues() {
    return Tasks.statusValues;
  }

  async getMany(_: unknown) {
    try {
      return await Task.find();
    } catch (error) {
      console.error("getById error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async getById(_: unknown, { id }: { id: string }) {
    try {
      const task = await Task.findById(id);

      if (!task) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return task;
    } catch (error) {
      console.error("getById error:", error);
      throw error instanceof GraphQLError
        ? error
        : new GraphQLError("Internal error", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
    }
  }

  async create(_: unknown, input: CreateInput) {
    const parseResult = TaskValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new GraphQLError("Validation error", {
        extensions: { code: "BAD_USER_INPUT", error: parseResult.error },
      });
    }

    try {
      return await Task.create(parseResult.data);
    } catch (error: any) {
      console.error("create error:", error);
      throw new GraphQLError("Failed to create task", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  async update(_: unknown, { id, ...input }: UpdateInput) {
    const TaskUpdateSchema = TaskValidationSchema.partial();
    const parseResult = TaskUpdateSchema.safeParse(input);

    if (!parseResult.success) {
      throw new GraphQLError("Validation error", {
        extensions: { code: "BAD_USER_INPUT", error: parseResult.error },
      });
    }

    try {
      const updatedTask = await Task.findByIdAndUpdate(id, parseResult.data, {
        runValidation: true,
        new: true,
      });

      if (!updatedTask) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id },
        });
      }

      return updatedTask;
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
      const deleted = await Task.findByIdAndDelete(id);

      if (!deleted) {
        throw new GraphQLError("Task not found", {
          extensions: { code: "NOT_FOUND", taskId: id },
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

export const taskResolvers = new Tasks();
export const taskTypeResolvers = Tasks.typeResolvers;
