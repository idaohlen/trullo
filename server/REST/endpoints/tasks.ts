import express, { type NextFunction, type Request, type Response } from "express";
import Task, { TaskValidationSchema } from "../../models/Task";

const router = express.Router();

router.get("/:taskId", getById);
router.put("/:taskId", updateById);
router.delete("/:taskId", deleteById);
router.post("/", createNew);
router.get("/", getAll);

async function createNew(req: Request, res: Response, next: NextFunction) {
  const parseResult = TaskValidationSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({
      status: "FAIL",
      message: "Validation error when parsing user input for a new task",
      error: parseResult.error
    });
  }
  try {
    const task = await Task.create(parseResult.data);
    res.status(200).json({ status: "SUCCESS", message: "Created new task", data: task });
  } catch (error) {
    next(error);
  }
}

async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ status: "SUCCESS", message: "Retrieved all tasks", data: tasks });
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await Task.findById(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Retrieved task by ID", data: task });
  } catch (error) {
    next(error);
  }
}

async function updateById(req: Request, res: Response, next: NextFunction) {
  const TaskUpdateSchema = TaskValidationSchema.partial();
  const parseResult = TaskUpdateSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({
      status: "FAIL",
      message: "Validation error when parsing user input for updating task data",
      error: parseResult.error
    });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, parseResult.data, {new: true });
    res.status(200).json({ status: "SUCCESS", message: "Updated task by ID", data: updatedTask });
  } catch (error) {
    next(error);
  }
}

async function deleteById(req: Request, res: Response, next: NextFunction) {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Deleted task by ID" });
  } catch (error) {
    next(error);
  }
}

export default router;
