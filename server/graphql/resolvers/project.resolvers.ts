import type { Types } from "mongoose";
import Project, { ProjectValidationSchema, type Project as ProjectDoc } from "../../models/Project.js";
import User from "../../models/User.js";
import { validateOrThrow, notFoundIfNull, badInputIfInvalidId } from "../utils/errorHandling.js";

type CreateInput = {
  title: string;
  description?: string;
  owner: Types.ObjectId | string;
  members: [Types.ObjectId | string];
};

type UpdateInput = {
  title: string;
  description?: string;
  owner?: Types.ObjectId | string;
  members?: [Types.ObjectId | string];
};

class Projects {
  static typeResolvers = {
    id: (doc: ProjectDoc) => String(doc._id),
    createdAt: (doc: ProjectDoc) => doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: ProjectDoc) => doc.updatedAt ? doc.updatedAt.toISOString() : null,
    membersList: async (doc: ProjectDoc, _args: unknown) => {
      return await User.find({ _id: { $in: doc.members } });
    }
  };

  /*
    GET MANY
  */
  async getMany(_: unknown) {
    return await Project.find();
  }

  /*
    GET MINE
  */
  async getMine(_: unknown, _args: unknown, context: { userId: string }) {
    return await Project.find({ members: context.userId });
  }

  /*
    GET BY ID
  */
  async getById(_: unknown, { id }: { id: string }) {
    badInputIfInvalidId(id, "Invalid project id", { projectId: id }); // validate ID
    const project = await Project.findById(id);

    notFoundIfNull(project, "Project not found", { projectId: id }); // error handling
    return project;
  }

  /*
    CREATE
  */
  async create(_: unknown, input: CreateInput) {
    // Validate input
    const data = validateOrThrow(ProjectValidationSchema, input);
    return await Project.create(data);
  }

  /*
    UPDATE
  */
  async update(_: unknown, { id, ...input }: UpdateInput) {
    badInputIfInvalidId(id, "Invalid project id", { projectId: id }); // validate ID
  
    // Validate input
    const ProjectUpdateSchema = ProjectValidationSchema.partial();
    const data = validateOrThrow(ProjectUpdateSchema, input);

    const update: Record<string, any> = { ...data };

    const updatedProject = await Project.findByIdAndUpdate(id, update, {
      runValidation: true,
      new: true,
    });

    notFoundIfNull(updatedProject, "Project not found", { projectId: id }); // error handling
    return updatedProject;
  }

  /*
    DELETE
  */
  async delete(_: unknown, { id }: { id: string }) {
    badInputIfInvalidId(id, "Invalid project id", { projectId: id }); // validate ID

    const deleted = await Project.findByIdAndDelete(id);
    notFoundIfNull(deleted, "Project not found", { projectId: id }); // error handling
    return true;
  }
}

export const projectResolvers = new Projects();
export const projectTypeResolvers = Projects.typeResolvers;
