import express, { type Request, type Response } from "express";
import usersResource from "./endpoints/users.js";
import projectsResource from "./endpoints/projects.js";
import tasksResource from "./endpoints/tasks.js";
import auth from "./endpoints/auth.js";
import { requireAuth } from "./middleware/auth.middleware.ts";
import { errorHandler } from "./middleware/error.middleware.ts";

const router = express.Router();

router.use("/users", requireAuth, usersResource);
router.use("/projects", requireAuth, projectsResource);
router.use("/tasks", requireAuth, tasksResource);
router.use("/auth", auth);

router.use("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Trullo RESTful API!",
    endpoints: {
      auth: {
        register: "/api/auth/register",
        login: "/api/auth/login",
      },
      tasks: "/api/tasks",
      users: "/api/users",
    },
  });
})
router.use(errorHandler);

export default router;
