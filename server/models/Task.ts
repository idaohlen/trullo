import mongoose, { type InferSchemaType, type Document } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"], required: true },
  finishedAt: { type: Date, default: null },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export type Task = InferSchemaType<typeof taskSchema> & Document;
export default mongoose.model("Task", taskSchema, "tasks");
