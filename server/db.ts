import mongoose from "mongoose";
import dotenv from "dotenv";
import { exit } from "node:process";

dotenv.config();

async function connectDB(): Promise<typeof mongoose | undefined> {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }
    const conn: typeof mongoose = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/trullo");
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error: unknown) {
    console.error("Database connection error:", error);
    exit(1);
  }
}

export default connectDB;
