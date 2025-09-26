import mongoose, { type InferSchemaType, type Document } from "mongoose";
import * as z from "zod";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
}, { timestamps: true });

export const ProjectValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ownerId: z.string().min(1, "An owner is required"),
  members: z.array(z.string()).optional(),
});

export type Project = InferSchemaType<typeof projectSchema> & Document;

// Delete existing model to force recompilation
if (mongoose.models.Project) delete mongoose.models.Project;

export default mongoose.model("Project", projectSchema, "projects");
