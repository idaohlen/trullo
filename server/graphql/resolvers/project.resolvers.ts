import mongoose, { type Types } from "mongoose";
import Project, {
  ProjectValidationSchema,
  type Project as ProjectDoc,
} from "../../models/Project.js";
import User from "../../models/User.js";
import {
  validateOrThrow,
  notFoundIfNull,
  badInputIfInvalidId,
} from "../utils/errorHandling.js";
import { paginateFind, paginateAggregate } from "../utils/pagination.js";

type CreateInput = {
  title: string;
  description?: string;
  ownerId: Types.ObjectId | string;
  members?: Types.ObjectId[] | string[];
};

type UpdateInput = {
  id: string;
  title?: string;
  description?: string;
  ownerId?: Types.ObjectId | string;
  members?: Types.ObjectId[] | string[];
};

class Projects {
  static typeResolvers = {
    id: (doc: ProjectDoc) => String(doc._id),
    createdAt: (doc: ProjectDoc) =>
      doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt: (doc: ProjectDoc) =>
      doc.updatedAt ? doc.updatedAt.toISOString() : null,
    membersList: async (doc: ProjectDoc, _args: unknown) => {
      // Combine owner and members, removing duplicates
      const allUserIds = [doc.ownerId, ...(doc.members || [])];
      const uniqueUserIds = [...new Set(allUserIds.map((id) => String(id)))];

      return await User.find({ _id: { $in: uniqueUserIds } });
    },
  };

  /*
    GET MANY
  */
  async getMany(
    _: unknown,
    { page, limit }: { page?: number; limit?: number }
  ) {
    const pipeline = [
      // { $match: {} },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$$ROOT",
              {
                owner: {
                  _id: "$owner._id",
                  name: "$owner.name",
                  email: "$owner.email",
                },
              },
            ],
          },
        },
      },
    ];
    return await paginateAggregate<ProjectDoc>(Project, pipeline, {
      page,
      limit,
    });
  }

  /*
    GET MINE
  */
  async getMine(
    _: unknown,
    { page, limit }: { page?: number; limit?: number },
    context: { userId: string }
  ) {
    return await paginateFind<ProjectDoc>(
      Project.find({
        $or: [{ ownerId: context.userId }, { members: context.userId }],
      }),
      { page, limit }
    );
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
    // Clean up null values - convert null to undefined for optional fields
    const cleanInput = {
      ...input,
      description: input.description === null ? undefined : input.description,
      members: input.members === null ? undefined : input.members,
    };

    // Validate input
    const data = validateOrThrow(ProjectValidationSchema, cleanInput);

    // Convert string IDs to ObjectIds for Mongoose
    const mongoData = {
      ...data,
      ownerId: new mongoose.Types.ObjectId(data.ownerId),
      members: data.members?.map((id) => new mongoose.Types.ObjectId(id)),
    };

    return await Project.create(mongoData);
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
    ADD MEMBER
  */
  async addMember(
    _: unknown,
    { projectId, userId }: { projectId: string; userId: string }
  ) {
    badInputIfInvalidId(projectId, "Invalid project id", { projectId });
    badInputIfInvalidId(userId, "Invalid user id", { userId });

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: new mongoose.Types.ObjectId(userId) } }, // $addToSet prevents duplicates
      { new: true, runValidators: true }
    );

    notFoundIfNull(project, "Project not found", { projectId });
    return project;
  }

  /*
    REMOVE MEMBER
  */
  async removeMember(
    _: unknown,
    { projectId, userId }: { projectId: string; userId: string }
  ) {
    badInputIfInvalidId(projectId, "Invalid project id", { projectId });
    badInputIfInvalidId(userId, "Invalid user id", { userId });

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: new mongoose.Types.ObjectId(userId) } }, // $pull removes the member
      { new: true, runValidators: true }
    );

    notFoundIfNull(project, "Project not found", { projectId });
    return project;
  }

  /*
    JOIN
  */
  async join(
    _: unknown,
    { projectId }: { projectId: string },
    context: { userId: string }
  ) {
    badInputIfInvalidId(projectId, "Invalid project id", { projectId });

    // Check if project exists and user is not already a member or owner
    const project = await Project.findById(projectId);
    const validProject = notFoundIfNull(project, "Project not found", {
      projectId,
    });

    // Check if user is already owner
    if (String(validProject.ownerId) === context.userId) {
      throw new Error("You are already the owner of this project");
    }

    // Check if user is already a member
    const isAlreadyMember =
      validProject.members &&
      validProject.members.some(
        (memberId: any) => String(memberId) === context.userId
      );

    if (isAlreadyMember) {
      throw new Error("You are already a member of this project");
    }

    // Add user to project members
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: new mongoose.Types.ObjectId(context.userId) } }, // $addToSet prevents duplicates
      { new: true, runValidators: true }
    );

    notFoundIfNull(updatedProject, "Project not found", { projectId });
    return updatedProject;
  }

  /*
    LEAVE
  */
  async leave(
    _: unknown,
    { projectId }: { projectId: string },
    context: { userId: string }
  ) {
    badInputIfInvalidId(projectId, "Invalid project id", { projectId });

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: new mongoose.Types.ObjectId(context.userId) } }, // Remove current user from members
      { new: true, runValidators: true }
    );

    notFoundIfNull(project, "Project not found", { projectId });
    return project;
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
