import type { Request, Response, NextFunction } from "express";
import Project from "../../models/Project.js";

// Assumes req.userId and req.role are set by requireAuth

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.role === "ADMIN") return next();
  return res.status(403).json({ status: "FAIL", message: "Admin role required" });
}

export function requireSelf(req: Request, res: Response, next: NextFunction) {
  if (req.userId === req.params.userId) return next();
  return res.status(403).json({ status: "FAIL", message: "You can only access your own resource" });
}

export function requireAdminOrSelf(req: Request, res: Response, next: NextFunction) {
  if (req.role === "ADMIN" || req.userId === req.params.userId) return next();
  return res.status(403).json({ status: "FAIL", message: "Admin or self required" });
}

export async function requireOwner(req: Request, res: Response, next: NextFunction) {
  // Check that project exists
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);

  // Check for owner
  if (project && String(project.ownerId) === req.userId) return next();
  return res.status(403).json({ status: "FAIL", message: "Owner access required" });
}

export async function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
  // Check that project exists
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);

  // Check if admin or owner
  if (req.role === "ADMIN" || (project && String(project.ownerId) === req.userId)) return next();
  return res.status(403).json({ status: "FAIL", message: "Admin or owner access required" });
}

export async function requireMember(req: Request, res: Response, next: NextFunction) {
  // Check that project exists
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ status: "FAIL", message: "Project not found" });

  // Check membership status
  const isMember = project.members.some((id: any) => String(id) === req.userId);
  if (isMember || String(project.ownerId) === req.userId) return next();
  return res.status(403).json({ status: "FAIL", message: "Member access required" });
}

export async function requireMemberOrAdmin(req: Request, res: Response, next: NextFunction) {
  // Proceed if admin
  if (req.role === "ADMIN") return next();

  // Check that project exists
  const projectId = req.params.projectId;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ status: "FAIL", message: "Project not found" });
  
  // Check membership status
  const isMember = project.members.some((id: any) => String(id) === req.userId);
  if (isMember || String(project.ownerId) === req.userId) return next();
  return res.status(403).json({ status: "FAIL", message: "Member or admin access required" });
}


