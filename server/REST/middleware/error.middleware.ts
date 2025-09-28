export function conflictError(message: string, errors?: unknown): never {
  throw new HttpError(message, 409, errors);
}
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const asyncHandler = <T = any>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export class HttpError extends Error {
  status: number;
  errors?: unknown;
  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof HttpError ? err.status : 500;
  res.status(status).json({
    status: "FAIL",
    message: err.message || "Internal server error",
    error: (err instanceof HttpError ? err.errors : undefined),
  });
}

export function validationError(error: ZodError): never {
  const formatted = error.issues.map(e => ({
    path: e.path.join("."),
    message: e.message
  }));
  throw new HttpError(
    "Validation error when parsing user input",
    400,
    formatted
  );
}

export function badRequest(message: string, errors?: unknown): never {
  throw new HttpError(message, 400, errors);
}

export function notFound(message: string): never {
  throw new HttpError(message, 404);
}
