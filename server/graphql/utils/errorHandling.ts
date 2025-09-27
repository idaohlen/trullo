import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import type { Middleware } from "../types";
import type { ZodType } from "zod";

export const withErrorHandling: Middleware = (next) => async (parent, args, context, info) => {
  try {
    return await next(parent, args, context, info);
  } catch (error) {
    console.error(`${info?.fieldName || "resolver"} error:`, error);
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Internal error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
  }
};

export function validateOrThrow<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    // Format errors as array of { path, message }
    const formatted = result.error.issues.map(e => ({
      path: e.path.join("."),
      message: e.message
    }));
    console.log("Validation failed:", formatted); // Debug log
    throw new GraphQLError(`Validation error: ${formatted.map(e => `${e.path}: ${e.message}`).join(", ")}`, {
      extensions: { code: "BAD_USER_INPUT", errors: formatted }
    });
  }
  return result.data;
}

export function notFoundIfNull<T>(value: T | null | undefined, message = "Not found", extensions?: Record<string, unknown>): T {
  if (value == null) {
    throw new GraphQLError(message, {
      extensions: { code: "NOT_FOUND", ...extensions }
    });
  }
  return value;
}

export function badInputIf(condition: boolean, message: string, extensions?: Record<string, unknown>): void {
  if (condition) {
    throw new GraphQLError(message, {
      extensions: { code: "BAD_USER_INPUT", ...extensions }
    });
  }
}

export function badInputIfInvalidId(id: string, message = "Invalid ID", extensions?: Record<string, unknown>) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new GraphQLError(message, {
      extensions: { code: "BAD_USER_INPUT", ...extensions }
    });
  }
}
