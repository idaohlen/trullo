import type { Types } from "mongoose";
import Task, {
  TaskValidationSchema,
  type TaskStatus,
  type Task as TaskDoc
} from "../../models/Task.js";
import User from "../../models/User.js";
import { excludePassword } from "../utils/sanitizeUser.js";
import { validateOrThrow, notFoundIfNull, badInputIfInvalidId } from "../utils/errorHandling.js";

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
  finishedAt?: string;
  assignedTo?: Types.ObjectId | string;
};

class Tasks {
  static typeResolvers = {
    id: (doc: TaskDoc) => String(doc._id),
    createdAt: (doc: TaskDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: TaskDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
    finishedAt: (doc: TaskDoc) => doc.finishedAt ? doc.finishedAt.toISOString() : null,
    user: async (doc: TaskDoc, _args: unknown) => {
      const user = await User.findById(doc.assignedTo);
      return user ? excludePassword(user) : null;
    }
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
    GET BY ID
  */
  async getById(_: unknown, { id }: { id: string }) {
    badInputIfInvalidId(id, "Invalid task id", { taskId: id }); // validate ID
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
  async update(_: unknown, { id, ...input }: UpdateInput) {
    badInputIfInvalidId(id, "Invalid task id", { taskId: id }); // validate ID

    // Validate input
    const TaskUpdateSchema = TaskValidationSchema.partial();
    const data = validateOrThrow(TaskUpdateSchema, input);

    const update: Record<string, any> = { ...data };

    // If status changes to DONE, set finishedAt date
    if (input.status === "DONE") update.finishedAt = new Date();
    else update.finishedAt = null;

    const updatedTask = await Task.findByIdAndUpdate(id, update, {
      runValidation: true,
      new: true,
    });

    notFoundIfNull(updatedTask, "Task not found", { taskId: id }); // error handling
    return updatedTask;
  }

  /*
    DELETE
  */
  async delete(_: unknown, { id }: { id: string }) {
    badInputIfInvalidId(id, "Invalid task id", { taskId: id }); // validate ID

    const deleted = await Task.findByIdAndDelete(id);
    notFoundIfNull(deleted, "Task not found", { taskId: id }); // error handling
    return true;
  }
}

export const taskResolvers = new Tasks();
export const taskTypeResolvers = Tasks.typeResolvers;
