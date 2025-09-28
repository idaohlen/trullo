import User, { type User as UserType } from "../../models/User.js";
import Project, {type Project as ProjectType } from "../../models/Project.js";
import { excludePassword } from "../../utils/sanitizeUser.js";
import type { Task as TaskType } from "../../models/Task.js";

export async function formatUserResponse(user: UserType) {
  if (!user) return null;
  return {
    ...user.toObject(),
    id: String(user._id),
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
}

export async function formatProjectResponse(project: ProjectType) {
  if (!project) return null;
  const rawProject = typeof (project as any).toObject === "function" ? (project as any).toObject() : project;
  const allUserIds = [rawProject.ownerId, ...(rawProject.members || [])];
  const uniqueUserIds = [...new Set(allUserIds.map((id) => String(id)))];
  const membersList = await User.find({ _id: { $in: uniqueUserIds } }).select("-password");

  return {
    ...rawProject,
    id: String(rawProject._id),
    membersList: membersList,
    createdAt: rawProject.createdAt ? rawProject.createdAt.toISOString() : null,
    updatedAt: rawProject.updatedAt ? rawProject.updatedAt.toISOString() : null,
  };
}

export async function formatTaskResponse(task: TaskType) {
  if (!task) return null;
  const rawTask = typeof (task as any).toObject === "function" ? (task as any).toObject() : task;
  const assignee = rawTask.assignedTo ? await User.findById(rawTask.assignedTo) : null;
  const finisher = rawTask.finishedBy ? await User.findById(rawTask.finishedBy) : null;
  const project = rawTask.projectId ? await Project.findById(rawTask.projectId) : null;

  return {
    ...rawTask,
    id: String(rawTask._id),
    projectId: String(rawTask.projectId),
    project: project,
    createdAt: rawTask.createdAt ? rawTask.createdAt.toISOString() : null,
    updatedAt: rawTask.updatedAt ? rawTask.updatedAt.toISOString() : null,
    finishedAt: rawTask.finishedAt ? rawTask.finishedAt.toISOString() : null,
    assignee: assignee ? excludePassword(assignee) : null,
    finisher: finisher ? excludePassword(finisher) : null,
  };
}

