import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import Task, {
  TaskValidationSchema,
  type Task as TaskType,
} from "../../models/Task";
import { paginateFind } from "../../utils/pagination.js";
import { formatTaskResponse } from "../utils/formatResponse.js";
import {
  asyncHandler,
  badRequest,
  notFound,
  validationError,
} from "../middleware/error.middleware.js";
import { requireMember, requireMemberOrAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/mine", asyncHandler(getMine));
router.get("/status-values", asyncHandler(getStatusValues));

router.get("/:taskId", asyncHandler(getById));
router.put("/:taskId", requireMemberOrAdmin, asyncHandler(updateById));
router.delete("/:taskId", requireMemberOrAdmin, asyncHandler(deleteById));

router.post("/", requireMember, asyncHandler(createNew));
router.get("/", requireMemberOrAdmin, asyncHandler(getAll));

const statusValues = ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"];

async function getStatusValues(_req: Request, res: Response) {
  res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved task status values",
    data: statusValues,
  });
}

/*
  CREATE
*/
async function createNew(req: Request, res: Response) {
  const input = req.body;

  // Validate input
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
async function getAll(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  const tasks = await paginateFind<TaskType>(Task.find(), { page, limit });
  const formattedTasks = await Promise.all(
    tasks.items.map((t: TaskType) => formatTaskResponse(t))
  );

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved tasks",
    data: formattedTasks,
  });
}

/*
  GET BY ID
*/
async function getById(req: Request, res: Response) {
  // Validate id
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) badRequest("Invalid id");

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
  GET MINE
*/
async function getMine(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;

  const tasks = await paginateFind<TaskType>(
    Task.find({ assignedTo: req.userId }),
    { page, limit }
  );
  const formattedTasks = await Promise.all(
    tasks.items.map((t: TaskType) => formatTaskResponse(t))
  );

  return res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved my tasks",
    data: formattedTasks,
  });
}

/*
  UPDATE
*/
async function updateById(req: Request, res: Response) {
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
async function deleteById(req: Request, res: Response) {
  // Validate id
  const { taskId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(taskId)) badRequest("Invalid task id");

  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) notFound("Task not found");

  res.status(200).json({ status: "SUCCESS", message: "Deleted task by id" });
}

export default router;
