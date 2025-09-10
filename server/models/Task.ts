import mongoose, { type InferSchemaType, type Document } from "mongoose";

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
}, { timestamps: true });

export type Task = InferSchemaType<typeof taskSchema> & Document;
export default mongoose.model("Task", taskSchema, "tasks");
