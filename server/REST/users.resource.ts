import express, { type Request, type Response } from "express";
import User from "../models/User";

const router = express.Router();

router.get("/:userId", getById);
router.put("/:userId", updateById);
router.delete("/:userId", deleteById);
router.post("/", createNew);
router.get("/", getAll);

async function createNew(req: Request, res: Response) {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ status: "SUCCESS", message: "Created new user", data: user });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const users = await User.find({});
    res.status(200).json({ status: "SUCCESS", message: "Retrieved all users", data: users });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function getById(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Retrieved user by ID", data: user });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function updateById(req: Request, res: Response) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true });
    res.status(200).json({ status: "SUCCESS", message: "Updated user by ID", data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

async function deleteById(req: Request, res: Response) {
  try {
    await User.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: "SUCCESS", message: "Deleted user by ID" });
  } catch (error) {
    res.status(500).json({ status: "FAIL", message: "Internal server error", error });
  }
}

export default router;
