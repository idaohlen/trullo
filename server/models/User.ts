import mongoose, { type InferSchemaType, type Document } from "mongoose";
import * as z from "zod";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

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
