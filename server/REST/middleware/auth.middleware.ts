import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Check for JWT secret
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET not set");

  // Check for auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: "FAIL", message: "No authorization token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    // Make sure payload token is valid
    const payload = jwt.verify(token, jwtSecret);
    if (typeof payload === "object" && "userId" in payload) {
      const jwtPayload = payload as JwtPayload & { userId: string; role?: string };
      req.userId = jwtPayload.userId;
      req.role = jwtPayload.role || undefined;
      next();
    } else {
      return res.status(401).json({ status: "FAIL", message: "Invalid token payload" });
    }
  } catch {
    return res.status(401).json({ status: "FAIL", message: "Invalid token" });
  }
}
