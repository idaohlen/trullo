import mongoose, { type InferSchemaType, type Document } from "mongoose";
import * as z from "zod";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
}, { timestamps: true });

export const ProjectValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  owner: z.string().min(1, "An owner is required"),
  members: z.array(z.string()).optional(),
});

export type Project = InferSchemaType<typeof projectSchema> & Document;
export default mongoose.models.Project || mongoose.model("Project", projectSchema, "projects");
