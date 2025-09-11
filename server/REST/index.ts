import express from "express";
import tasksResource from "./tasks.resource.js";
import usersResource from "./users.resource.js";

const router = express.Router();

router.use("/tasks", tasksResource);
router.use("/users", usersResource);


export default router;
