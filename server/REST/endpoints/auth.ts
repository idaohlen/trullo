import express, { type Request, type Response, type NextFunction } from "express";
import User, { UserValidationSchema } from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

async function registerUser(req: Request, res: Response, next: NextFunction) {
  const parseResult = UserValidationSchema.safeParse({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 10),
  });

  if (!parseResult.success) {
    return res.status(400).json({
      status: "FAIL",
      message: "Validation error when parsing user input for a new user",
      error: parseResult.error,
    });
  }
  try {
    // Check for existing email
    const existingUser = await User.findOne({ email: parseResult.data.email });
    if (existingUser) {
      return res.status(409).json({
        status: "FAIL",
        message: "Email already exists",
      });
    }

    const user = await User.create(parseResult.data);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ status: "SUCCESS", message: "Created new user", data: user, token });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1d",
    });
    res.status(200).json({ status: "SUCCESS", message: "Logged in user", data: user, token });
  } catch (error) {
    next(error);
  }
}

export default router;
