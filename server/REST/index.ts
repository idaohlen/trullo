import express, { type Request, type Response } from "express";
import auth from "./routes/auth.route.js";
import users from "./routes/users.route.js";
import projects from "./routes/projects.route.js";
import tasks from "./routes/tasks.route.js";
import { requireAuth } from "./middleware/auth.middleware.ts";
import { errorHandler } from "./middleware/error.middleware.ts";

const router = express.Router();

router.use("/auth", auth);
router.use("/users", requireAuth, users);
router.use("/projects", requireAuth, projects);
router.use("/tasks", requireAuth, tasks);

// Welcome route
router.get("/", (_req: Request, res: Response) => {
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
});

// Catch-all for invalid routes
router.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "FAIL",
    route: req.originalUrl,
    method: req.method,
    message: `Route not found: ${req.originalUrl} [${req.method}]. Check your spelling and HTTP method.`
  });
});

router.use(errorHandler);

export default router;
