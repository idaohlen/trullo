import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { excludePassword } from "../../utils/sanitizeUser.js";
import User, { UserValidationSchema } from "../../models/User.js";

export type GraphQLContext = {
  req: Request;
  res: Response;
  userId?: string | null;
  role?: string | null;
};

type RegistrationInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return secret;
}

async function logoutUser(_: unknown, _args: unknown, context: GraphQLContext) {
  context.res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
  return true;
}

async function loginUser(
  _: unknown,
  { email, password }: LoginInput,
  context: GraphQLContext
) {
  try {
    // Check if user email exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new GraphQLError("Wrong credentials", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Compare if password is correct
    const correctPassword = await existingUser.comparePassword(password);
    if (!correctPassword) {
      throw new GraphQLError("Wrong credentials", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      getJwtSecret(),
      {
        expiresIn: "1d",
      }
    );

    context.res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return token and user (excluding password)
    return { token, user: excludePassword(existingUser) };
  } catch (error) {
    console.error("loginUser error:", error);
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Internal error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
  }
}

async function registerUser(
  _: unknown,
  input: RegistrationInput,
  context: GraphQLContext
) {
  try {
    // Validate user input
    const parseResult = UserValidationSchema.safeParse(input);
    if (!parseResult.success) {
      throw new GraphQLError("Validation error", {
        extensions: { code: "BAD_USER_INPUT", error: parseResult.error },
      });
    }

    // Check for conflicting email
    const existingUser = await User.findOne({ email: parseResult.data.email });
    if (existingUser) {
      throw new GraphQLError("Email already exists", {
        extensions: { code: "CONFLICT" },
      });
    }

    // Create user
    const user = await User.create(parseResult.data);

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getJwtSecret(),
      {
        expiresIn: "1d",
      }
    );
    context.res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return token and user (excluding password)
    return { token, user: excludePassword(user) };
  } catch (error) {
    console.error("registerUser error:", error);
    throw error instanceof GraphQLError
      ? error
      : new GraphQLError("Internal error", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
  }
}

export const auth = {
  logoutUser,
  loginUser,
  registerUser,
};
