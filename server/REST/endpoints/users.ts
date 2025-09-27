import mongoose from "mongoose";
import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import User, {
  UserValidationSchema,
  type User as UserType,
} from "../../models/User";
import Task from "../../models/Task.js";
import {
  asyncHandler,
  badRequest,
  notFound,
  validationError,
} from "../middleware/error.middleware.js";
import { paginateFind } from "../../utils/pagination.js";
import { excludePassword } from "../../utils/sanitizeUser.js";

const router = express.Router();

router.put("/:userId/role", asyncHandler(updateRole));
router.get("/:userId", asyncHandler(getById));
router.put("/:userId", asyncHandler(updateById));
router.delete("/:userId", asyncHandler(deleteById));

router.get("/roles", asyncHandler(getRoles));
router.get("/me", asyncHandler(getMe));
router.get("/", asyncHandler(getAll));

const roles = ["USER", "ADMIN"];

async function getRoles(_req: Request, res: Response) {
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Retrieved user roles", data: roles });
}

/*
  GET ALL
*/
async function getAll(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 25;
  const rawSearch = req.query.search;
  const search = typeof rawSearch === "string"
    ? rawSearch
    : Array.isArray(rawSearch)
      ? rawSearch[0]
      : "";

  const match: any = {};
  if (typeof search === "string" && search.trim()) {
    match.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await paginateFind<UserType>(
    User.find(match).select("-password"),
    { page, limit }
  );
  res
    .status(200)
    .json({ status: "SUCCESS", message: "Retrieved users", data: users });
}

/*
  GET BY ID
*/
async function getById(req: Request, res: Response) {
  // Validate id
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid id");

  // Check if user exists
  const user = await User.findById(userId).select("-password");
  if (!user) notFound("User not found");

  res
    .status(200)
    .json({ status: "SUCCESS", message: "Retrieved user by id", data: user });
}

/*
  GET ME
*/
async function getMe(req: Request, res: Response) {
  // Validate id
  const userId = req.userId || "";
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid id");

  // Check that user exists
  const user = await User.findById(userId).select("-password");
  if (!user) notFound("User not found");

  res
    .status(200)
    .json({ status: "SUCCESS", message: "Retrieved my user data", data: user });
}

/*
  UPDATE
*/
async function updateById(req: Request, res: Response) {
  const input = req.body;

  // Validate id
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid id");

  // Validate input
  const UserUpdateSchema = UserValidationSchema.partial();
  const parseResult = UserUpdateSchema.safeParse(input);
  if (!parseResult.success) validationError(parseResult.error);

  const user = await User.findById(userId);
  if (!user) notFound("User not found");

  // Check if this is a self-update (user updating their own profile)
  const isSelfUpdate = req.userId === userId;

  // Check if email or password are actually changing
  const emailChanged = input.email !== undefined && input.email !== user.email;
  const passwordChanged =
    input.password !== undefined && input.password.trim() !== "";

  // If user is updating their own email or password, require current password
  if (isSelfUpdate && (emailChanged || passwordChanged)) {
    if (!input.currentPassword)
      badRequest(
        "Current password is required when changing email or password"
      );

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(
      input.currentPassword
    );
    if (!isCurrentPasswordValid) badRequest("Current password is incorrect");
  }

  // Hash password if provided
  const updateData = { ...parseResult.data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });
  res.status(200).json({
    status: "SUCCESS",
    message: "Updated user by id",
    data: excludePassword(updatedUser),
  });
}

/*
  UPDATE ROLE
*/
async function updateRole(req: Request, res: Response) {
  const { role } = req.body;
  // Validate id
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid id");

  // Check that user exists
  const user = await User.findByIdAndUpdate(userId, { role }, {
    new: true,
  }).select("-password");
  if (!user) notFound("User not found");

  res
    .status(200)
    .json({ status: "SUCCESS", message: "Updated user role", data: user });
}

/*
  DELETE
*/
async function deleteById(req: Request, res: Response) {
  // Validate id
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) badRequest("Invalid id");

  // Check if user exists
  const user = await User.findByIdAndDelete(userId);
  if (!user) notFound("User not found");

  // If the user is deleting their own account, clear the auth cookie (log out)
  const isSelfDelete = req.userId && req.userId === String(userId);
  if (isSelfDelete && res) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
  }

  await Task.updateMany({ assignedTo: userId }, { assignedTo: null });
  await User.findByIdAndDelete(userId);

  res.status(200).json({ status: "SUCCESS", message: "Deleted user by id" });
}

export default router;
