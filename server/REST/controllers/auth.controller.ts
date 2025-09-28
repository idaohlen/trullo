import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { UserValidationSchema } from "../../models/User.js";

import { excludePassword } from "../../utils/sanitizeUser.js";
import {
  conflictError,
  validationError,
} from "../middleware/error.middleware.js";

dotenv.config();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

/*
  REGISTER
*/
async function registerUser(req: Request, res: Response) {
  // Validate input
  const parseResult = UserValidationSchema.safeParse(req.body);
  if (!parseResult.success) validationError(parseResult.error);

  // Check for conflicting email
  const existingUser = await User.findOne({ email: parseResult.data.email });
  if (existingUser) conflictError("Email already exists");

  const user = await User.create(parseResult.data);

  // Create token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    getJwtSecret(),
    {
      expiresIn: "1d",
    }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "SUCCESS",
    message: "Created new user",
    data: { user: excludePassword(user) },
    token,
  });
}

/*
  LOGIN
*/
async function loginUser(req: Request, res: Response) {
  // Check if user email exists
  const existingUser = await User.findOne({ email: req.body.email });
  if (!existingUser)
    return res.status(401).json({ error: "Invalid credentials" });

  // Compare password
  const correctPassword = await existingUser.comparePassword(req.body.password);
  if (!correctPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  // Create token
  const token = jwt.sign(
    { userId: existingUser._id, role: existingUser.role },
    getJwtSecret(),
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "SUCCESS",
    message: "Logged in user",
    data: { user: excludePassword(existingUser) },
    token,
  });
}

/*
  LOGOUT
*/
async function logoutUser(_req: Request, res: Response) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
  res.status(200).json({ status: "SUCCESS", message: "Logged out user" });
}

export default {
  register: registerUser,
  login: loginUser,
  logout: logoutUser
};
