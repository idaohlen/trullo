import mongoose, { type InferSchemaType, type Document } from "mongoose";
import * as z from "zod";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
}, { timestamps: true });

export const UserValidationSchema = z.object({ 
  name: z.string(),
  email: z.email(),
  password: z.string()
    .min(8, "Password needs to be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

export type User = InferSchemaType<typeof userSchema> & Document;
export default mongoose.models.User || mongoose.model("User", userSchema, "users");
