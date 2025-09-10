import mongoose, { type InferSchemaType, type Document } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
}, { timestamps: true });

export type User = InferSchemaType<typeof userSchema> & Document;
export default mongoose.models.User || mongoose.model("User", userSchema, "users");
