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
  // const owner = project.ownerId ? await User.findById(project.ownerId) : null;
  const allUserIds = [project.ownerId, ...(project.members || [])];
  const uniqueUserIds = [...new Set(allUserIds.map((id) => String(id)))];
  const membersList = await User.find({ _id: { $in: uniqueUserIds } }).select("-password");


  return {
    ...project.toObject(),
    id: String(project._id),
    // owner: owner,
    membersList: membersList,
    createdAt: project.createdAt ? project.createdAt.toISOString() : null,
    updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
  };
}

export async function formatTaskResponse(task: TaskType) {
  if (!task) return null;
  const assignee = task.assignedTo ? await User.findById(task.assignedTo) : null;
  const finisher = task.finishedBy ? await User.findById(task.finishedBy) : null;
  const project = task.projectId ? await Project.findById(task.projectId) : null;

  return {
    ...task.toObject(),
    id: String(task._id),
    projectId: String(task.projectId),
    project: project,
    createdAt: task.createdAt ? task.createdAt.toISOString() : null,
    updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
    finishedAt: task.finishedAt ? task.finishedAt.toISOString() : null,
    assignee: assignee ? excludePassword(assignee) : null,
    finisher: finisher ? excludePassword(finisher) : null,
  };
}

