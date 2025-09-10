import mongoose, { type InferSchemaType, type Document } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

export type Task = InferSchemaType<typeof taskSchema> & Document;
export default mongoose.model("Task", taskSchema, "tasks");
