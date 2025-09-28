import express from "express";
import tasks from "../controllers/tasks.controller.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks/mine:
 *   get:
 *     summary: Get tasks assigned to the current user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks assigned to the user
 */
router.get("/mine", asyncHandler(tasks.getMine));

/**
 * @swagger
 * /tasks/status-values:
 *   get:
 *     summary: Get all possible task status values
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of status values
 */
router.get("/status-values", asyncHandler(tasks.getStatusValues));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of all tasks
 */
router.get("/", requireAdmin, asyncHandler(tasks.getAll));

export default router;
