import express from "express";
import tasksResource from "./endpoints/tasks.js";
import usersResource from "./endpoints/users.js";
import auth from "./endpoints/auth.js";
import { requireAuth } from "./middleware/auth.middleware.ts";

const router = express.Router();

router.use("/tasks", requireAuth, tasksResource);
router.use("/users", requireAuth, usersResource);
router.use("/auth", auth);

export default router;
