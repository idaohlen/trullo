import express from "express";
import tasksResource from "./tasks.resource.js";
import usersResource from "./users.resource.js";
import auth from "./auth.js";

const router = express.Router();

router.use("/tasks", tasksResource);
router.use("/users", usersResource);
router.use("/auth", auth);

export default router;
