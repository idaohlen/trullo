import { type Request, type Response } from "express";
import Task, { type Task as TaskType } from "../../models/Task";
import { paginateFind } from "../../utils/pagination.js";
import { formatTaskResponse } from "../utils/formatResponse.js";

const statusValues = ["TO_DO", "IN_PROGRESS", "BLOCKED", "DONE"];

/*
  GET STATUS VALUES
*/
async function getStatusValues(_req: Request, res: Response) {
  res.status(200).json({
    status: "SUCCESS",
    message: "Retrieved task status values",
    data: statusValues,
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

export default {
  getAll,
  getMine,
  getStatusValues
};
