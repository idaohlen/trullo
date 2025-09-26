import mongoose, { type InferSchemaType, type Document } from "mongoose";
import * as z from "zod";

export const TASK_STATUSES = ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: TASK_STATUSES, required: true, default: "TO_DO" },
  finishedAt: { type: Date, default: null },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  finishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectId: {
  type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
}, { timestamps: true });

export const TaskValidationSchema = z.object({ 
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  assignedTo: z.string().optional(),
  finishedBy: z.string().optional(),
  finishedAt: z.date().optional(),
  projectId: z.string().min(1, "A project is required"),
});

export type Task = InferSchemaType<typeof taskSchema> & Document;

if (mongoose.models.Task) delete mongoose.models.Task;
export default mongoose.model("Task", taskSchema, "tasks");
