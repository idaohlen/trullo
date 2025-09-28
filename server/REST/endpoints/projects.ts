import mongoose, { type PipelineStage } from "mongoose";
import express, { type Request, type Response } from "express";
import Project, {
  ProjectValidationSchema,
  type Project as ProjectType,
} from "../../models/Project.js";
import Task, { type Task as TaskType } from "../../models/Task.js";
import {
  formatTaskResponse,
  formatProjectResponse,
} from "../utils/formatResponse.js";
import { paginateFind, paginateAggregate } from "../../utils/pagination.js";
import {
  asyncHandler,
  badRequest,
  notFound,
  validationError,
} from "../middleware/error.middleware.js";
import { requireMember, requireMemberOrAdmin, requireOwnerOrAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/mine", asyncHandler(getMine));

router.post("/:projectId/members/:userId", requireOwnerOrAdmin, asyncHandler(addMember));
router.delete("/:projectId/members/:userId", asyncHandler(removeMember));

router.get("/:projectId/tasks", requireMemberOrAdmin, asyncHandler(getProjectTasks));
router.post("/:projectId/join", asyncHandler(join));
router.post("/:projectId/leave", requireMember, asyncHandler(leave));

router.get("/:projectId", requireMemberOrAdmin, asyncHandler(getById));
router.put("/:projectId", requireOwnerOrAdmin, asyncHandler(updateById));
router.delete("/:projectId", requireOwnerOrAdmin, asyncHandler(deleteById));

router.post("/", asyncHandler(createNew));
router.get("/", asyncHandler(getAll));

export default router;

/*
  CREATE
*/
async function createNew(req: Request, res: Response) {
  const input = req.body;
  const cleanInput = {
    ...input,
    description: input.description === null ? undefined : input.description,
    members: input.members === null ? undefined : input.members,
  };

  // Validate input
  const parseResult = ProjectValidationSchema.safeParse(cleanInput);
  if (!parseResult.success) validationError(parseResult.error);

  // Convert string IDs to ObjectIds for Mongoose
  const mongoData = {
    ...parseResult.data,
    ownerId: new mongoose.Types.ObjectId(parseResult.data.ownerId),
    members: parseResult.data.members?.map(
      (id) => new mongoose.Types.ObjectId(id)
    ),
  };

  const project = await Project.create(mongoData);

  res.status(200).json({
    status: "SUCCESS",
    message: "Created new project",
    data: await formatProjectResponse(project),
  });
}

/*
  GET ALL
*/
async function getAll(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const rawSearch = req.query.search;
  const search =
    typeof rawSearch === "string"
      ? rawSearch
      : Array.isArray(rawSearch)
      ? rawSearch[0]
      : "";

  const match: any = {};
  if (typeof search === "string" && search.trim()) {
    match.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pipeline: PipelineStage[] = [
    Object.keys(match).length ? { $match: match } : undefined,
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
  ].filter(Boolean) as PipelineStage[];

  const tasks = await paginateAggregate<ProjectType>(Project, pipeline, {
    page,
    limit,
  });
  const formattedProjects = await Promise.all(
    tasks.items.map((p: ProjectType) => formatProjectResponse(p))
  );

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved projects",
    data: formattedProjects,
  });
}

/*
  GET BY ID
*/
async function getById(req: Request, res: Response) {
  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid id");

  // Check if project exists
  const project = await Project.findById(projectId);
  if (!project) notFound("Project not found");

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved project",
    data: formatProjectResponse(project),
  });
}

/*
  GET PROJECT TASKS
*/
async function getProjectTasks(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid id");

  const basePipeline = [
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
  ];

  const tasks = await paginateAggregate<TaskType>(Task, basePipeline, {
    page,
    limit,
  });
  const formattedTasks = await Promise.all(
    tasks.items.map((t: TaskType) => formatTaskResponse(t))
  );

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved project tasks",
    data: formattedTasks,
  });
}

/*
  GET MINE
*/
async function getMine(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  const projects = await paginateFind<ProjectType>(
    Project.find({
      $or: [{ ownerId: req.userId }, { members: req.userId }],
    }),
    { page, limit }
  );
  const formattedProjects = await Promise.all(
    projects.items.map((p: ProjectType) => formatProjectResponse(p))
  );

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved my projects",
    data: formattedProjects,
  });
}

/*
  UPDATE
*/
async function updateById(req: Request, res: Response) {
  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid id");

  // Validate input
  const ProjectUpdateSchema = ProjectValidationSchema.partial();
  const parseResult = ProjectUpdateSchema.safeParse(req.body);
  if (!parseResult.success) validationError(parseResult.error);

  const update: Record<string, any> = { ...parseResult.data };

  const updatedProject = await Project.findByIdAndUpdate(projectId, update, {
    runValidation: true,
    new: true,
  });

  if (!updatedProject) notFound("Project not found");
  res.status(200).json({
    status: "SUCCESS",
    message: "Updated task by id",
    data: await formatProjectResponse(updatedProject),
  });
}

/*
  ADD MEMBER
*/
async function addMember(req: Request, res: Response) {
  // Validate id
  const { projectId, userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId))
    badRequest("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid user id");

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: new mongoose.Types.ObjectId(userId) } }, // $addToSet prevents duplicates
    { new: true, runValidators: true }
  );
  if (!updatedProject) notFound("Project not found");

  res.status(200).json({
    status: "SUCCESS",
    message: "Added user to project",
    data: await formatProjectResponse(updatedProject),
  });
}

/*
  REMOVE MEMBER
*/
async function removeMember(req: Request, res: Response) {
  // Validate id
  const { projectId, userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId))
    badRequest("Invalid project id");
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid user id");

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: new mongoose.Types.ObjectId(userId) } }, // $pull removes the member
    { new: true, runValidators: true }
  );
  if (!updatedProject) notFound("Project not found");

  res.status(200).json({
    status: "SUCCESS",
    message: "Removed user from project",
    data: await formatProjectResponse(updatedProject),
  });
}

/*
  JOIN
*/
async function join(req: Request, res: Response) {
  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId))
    badRequest("Invalid task id");

  // Check if project exists and user is not already a member or owner
  const project = await Project.findById(projectId);
  if (!project) notFound("Project not found");

  // Check if user is already owner
  if (String(project.ownerId) === req.userId) {
    throw new Error("You are already the owner of this project");
  }

  // Check if user is already a member
  const isAlreadyMember =
    project.members &&
    project.members.some((memberId: any) => String(memberId) === req.userId);

  if (isAlreadyMember) {
    throw new Error("You are already a member of this project");
  }

  // Add user to project members
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: new mongoose.Types.ObjectId(req.userId) } }, // $addToSet prevents duplicates
    { new: true, runValidators: true }
  );
  if (!updatedProject) notFound("Project not found");

  res.status(200).json({
    status: "SUCCESS",
    message: "Joined project",
    data: await formatProjectResponse(updatedProject),
  });
}

/*
  LEAVE
*/
async function leave(req: Request, res: Response) {
  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId))
    badRequest("Invalid task id");

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: new mongoose.Types.ObjectId(req.userId) } }, // Remove current user from members
    { new: true, runValidators: true }
  );
  if (!project) notFound("Project not found");

  res.status(200).json({
    status: "SUCCESS",
    message: "Left project",
    data: await formatProjectResponse(project),
  });
}

/*
  DELETE
*/
async function deleteById(req: Request, res: Response) {
  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid id");

  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject) notFound("Project not found");

  res.status(200).json({ status: "SUCCESS", message: "Deleted project by id" });
}
