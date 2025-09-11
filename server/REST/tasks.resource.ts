import express, { type Request, type Response } from "express";
import Task from "../models/Task";

const router = express.Router();

router.get("/:taskId", getById);
router.put("/:taskId", updateById);
router.delete("/:taskId", deleteById);
router.post("/", createNew);
router.get("/", getAll);

async function createNew(req: Request, res: Response) {
  try {
    const task = await Task.create(req.body);
    res.status(200).json({ status: "SUCCESS", message: "Created new task", data: task });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ status: "SUCCESS", message: "Retrieved all tasks", data: tasks });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const task = await Task.findById(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Retrieved task by ID", data: task });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function updateById(req: Request, res: Response) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, {new: true });
    res.status(200).json({ status: "SUCCESS", message: "Updated task by ID", data: updatedTask });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function deleteById(req: Request, res: Response) {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Deleted task by ID" });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

export default router;
