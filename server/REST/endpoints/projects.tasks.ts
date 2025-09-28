import express from "express";
import mongoose from "mongoose";
import { type Request, type Response } from "express";
import Task, { TaskValidationSchema, type Task as TaskType } from "../../models/Task.js";
import { formatTaskResponse } from "../utils/formatResponse.js";
import { paginateAggregate } from "../../utils/pagination.js";
import { asyncHandler, badRequest, notFound, validationError } from "../middleware/error.middleware.js";

const tasksRouter = express.Router();

tasksRouter.post("/:projectId/tasks", asyncHandler(createTask));
tasksRouter.get("/:projectId/tasks", asyncHandler(getAll));
tasksRouter.get("/:projectId/tasks/:taskId", asyncHandler(getById));
tasksRouter.put("/:projectId/tasks/:taskId", asyncHandler(updateById));
tasksRouter.delete("/:projectId/tasks/:taskId", asyncHandler(deleteById));

/*
  CREATE
*/
export async function createTask(req: Request, res: Response) {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid project id");
  const Project = require("../../models/Project.js").default;
  const project = await Project.findById(projectId);
  if (!project) notFound("Project not found");
  const input = req.body;
  input.projectId = projectId;
  const parseResult = TaskValidationSchema.safeParse(input);
  if (!parseResult.success) validationError(parseResult.error);
  const task = await Task.create(parseResult.data);
  res.status(200).json({
    status: "SUCCESS",
    message: "Created new task",
    data: await formatTaskResponse(task),
  });
}

/*
  GET ALL
*/
export async function getAll(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  // Validate id
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) badRequest("Invalid project id");

  const basePipeline = [
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
  ];

  const tasks = await paginateAggregate<TaskType>(Task, basePipeline, { page, limit });
  const formattedTasks = await Promise.all(tasks.items.map((t: TaskType) => formatTaskResponse(t)));
  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved project tasks",
    data: formattedTasks,
  });
}

/*
  GET BY ID
*/
async function getById(req: Request, res: Response) {
  // Validate id
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) badRequest("Invalid task id");

  // Check that task exists
  const task = await Task.findById(taskId);
  if (!task) notFound("Task not found");

  // Format task with additional fields
  const response = await formatTaskResponse(task);
  res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved task by id",
    data: response,
  });
}

/*
  UPDATE
*/
export async function updateById(req: Request, res: Response) {
  const input = req.body;
  // Validate id
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) badRequest("Invalid task id");

  // Validate input
  const TaskUpdateSchema = TaskValidationSchema.partial();
  const parseResult = TaskUpdateSchema.safeParse(req.body);
  if (!parseResult.success) validationError(parseResult.error);

  const update: Record<string, any> = { ...parseResult };
  if (input.status) {
    if (input.status === "DONE") {
      update.finishedAt = new Date();
      update.finishedBy = new mongoose.Types.ObjectId(req.userId);
    } else {
      update.finishedAt = null;
      update.finishedBy = null;
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, update, {
    runValidation: true,
    new: true,
  });
  if (!updatedTask) notFound("Task not found");

  res.status(200).json({
    status: "SUCCESS",
    message: "Updated task by id",
    data: await formatTaskResponse(updatedTask),
  });
}

/*
  DELETE
*/
export async function deleteById(req: Request, res: Response) {
  // Validate id
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) badRequest("Invalid task id");

  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) notFound("Task not found");

  res.status(200).json({ status: "SUCCESS", message: "Deleted task by id" });
}

export default tasksRouter;
