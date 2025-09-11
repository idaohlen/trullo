import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Default to 500 if not set
  const status = err.status || 500;
  res.status(status).json({
    status: "FAIL",
    message: err.message || "Internal server error",
    error: err,
  });
}
