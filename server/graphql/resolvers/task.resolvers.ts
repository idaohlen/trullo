import mongoose, { type Types } from "mongoose";
import Task, {
  TaskValidationSchema,
  type TaskStatus,
  type Task as TaskDoc,
} from "../../models/Task.js";
import User from "../../models/User.js";
import Project from "../../models/Project.js";
import { excludePassword } from "../utils/sanitizeUser.js";
import {
  validateOrThrow,
  notFoundIfNull,
  badInputIfInvalidId,
} from "../utils/errorHandling.js";
import { paginateAggregate } from "../utils/pagination.js";

type CreateInput = {
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId | string;
  projectId: Types.ObjectId | string;
};

type UpdateInput = {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  finishedAt?: string;
  assignedTo?: Types.ObjectId | string;
};

class Tasks {
  static typeResolvers = {
    id: (doc: TaskDoc) => String(doc._id),
    projectId: (doc: TaskDoc) => String(doc.projectId),
    project: async (doc: TaskDoc) => await Project.findById(doc.projectId),
    createdAt: (doc: TaskDoc) =>
      doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: TaskDoc) =>
      doc.updatedAt ? doc.updatedAt.toISOString() : null,
    finishedAt: (doc: TaskDoc) =>
      doc.finishedAt ? doc.finishedAt.toISOString() : null,
    assignee: async (doc: TaskDoc, _args: unknown) => {
      const user = await User.findById(doc.assignedTo);
      return user ? excludePassword(user) : null;
    },
    finisher: async (doc: TaskDoc, _args: unknown) => {
      const user = await User.findById(doc.finishedBy);
      return user ? excludePassword(user) : null;
    },
  };

  static statusValues = ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"];

  async getStatusValues() {
    return Tasks.statusValues;
  }

  /*
    GET MANY
  */
  async getMany(_: unknown) {
    return await Task.find();
  }

  /*
    GET BY PROJECT
  */
  async getByProject(
    _: unknown,
    {
      projectId,
      page,
      limit,
    }: { projectId: string; page?: number; limit?: number }
  ) {
    const basePipeline = [
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    ];

    return await paginateAggregate<TaskDoc>(Task, basePipeline, {
      page,
      limit,
    });
  }

  /*
    GET MINE
  */
  async getMine(_: unknown, _args: unknown, context: { userId: string }) {
    return await Task.find({ assignedTo: context.userId });
  }

  /*
    GET BY ID
  */
  async getById(_: unknown, { id }: { id: string }) {
    // validate ID
    badInputIfInvalidId(id, "Invalid task id", { taskId: id });
    const task = await Task.findById(id);

    notFoundIfNull(task, "Task not found", { taskId: id }); // error handling
    return task;
  }

  /*
    CREATE
  */
  async create(_: unknown, input: CreateInput) {
    // Validate input
    const data = validateOrThrow(TaskValidationSchema, input);
    return await Task.create(data);
  }

  /*
    UPDATE
  */
  async update(
    _: unknown,
    { id, ...input }: UpdateInput,
    context: { userId: string }
  ) {
    // validate ID
    badInputIfInvalidId(id, "Invalid task id", { taskId: id });

    // Validate input (only the fields that come from the client)
    const TaskUpdateSchema = TaskValidationSchema.partial();
    const data = validateOrThrow(TaskUpdateSchema, input);

    const update: Record<string, any> = { ...data };

    if (input.status) {
      if (input.status === "DONE") {
        update.finishedAt = new Date();
        update.finishedBy = new mongoose.Types.ObjectId(context.userId);
      } else {
        update.finishedAt = null;
        update.finishedBy = null;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, update, {
      runValidation: true,
      new: true,
    });

    notFoundIfNull(updatedTask, "Task not found", { taskId: id });

    return updatedTask;
  }

  /*
    DELETE
  */
  async delete(_: unknown, { id }: { id: string }) {
    // validate ID
    badInputIfInvalidId(id, "Invalid task id", { taskId: id });

    const deleted = await Task.findByIdAndDelete(id);
    notFoundIfNull(deleted, "Task not found", { taskId: id }); // error handling
    return true;
  }
}

export const taskResolvers = new Tasks();
export const taskTypeResolvers = Tasks.typeResolvers;
