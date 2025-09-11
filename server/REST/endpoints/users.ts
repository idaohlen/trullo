import express, { type NextFunction, type Request, type Response } from "express";
import User, { UserValidationSchema } from "../../models/User";

const router = express.Router();

router.get("/:userId", getById);
router.put("/:userId", updateById);
router.delete("/:userId", deleteById);
router.get("/", getAll);

async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({});
    res.status(200).json({ status: "SUCCESS", message: "Retrieved all users", data: users });
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({ status: "SUCCESS", message: "Retrieved user by ID", data: user });
  } catch (error) {
    next(error);
  }
}

async function updateById(req: Request, res: Response, next: NextFunction) {
  const UserUpdateSchema = UserValidationSchema.partial();
  const parseResult = UserUpdateSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({
      status: "FAIL",
      message: "Validation error when parsing user input for updating user data",
      error: parseResult.error
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, parseResult.data, {new: true });
    res.status(200).json({ status: "SUCCESS", message: "Updated user by ID", data: updatedUser });
  } catch (error) {
    next(error);
  }
}

async function deleteById(req: Request, res: Response, next: NextFunction) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    
    if (!deletedUser) return res.status(404).json({
      status: "FAIL",
      message: "User not found"
    });
    
    res.status(200).json({ status: "SUCCESS", message: "Deleted user by ID" });
  } catch (error) {
    next(error);
  }
}

export default router;
