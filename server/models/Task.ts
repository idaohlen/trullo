import mongoose from "mongoose";
import type { Document, Model, Schema } from "mongoose";

export interface Task extends Document {
  title: string;
}

const schema: Schema<Task> = new mongoose.Schema({
  title: { type: String, required: true },
});

const TaskModel: Model<Task> = mongoose.model<Task>("Task", schema, "tasks");

export default TaskModel;
