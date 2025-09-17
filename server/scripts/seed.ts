import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Task from "../models/Task.js";
import users from "./seed-data/users.js";
import tasks from "./seed-data/tasks.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

function randomItem(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  // Connect to database
  if (!MONGO_URI) {
    console.log("A MONGO_URI variable must be provided in the .env file.");
    return;
  };
  await mongoose.connect(MONGO_URI);
  console.log("Connected:", MONGO_URI);

  // Purge the database
  await Promise.all([
    Task.deleteMany({}),
    User.deleteMany({}),
  ]);

  // Hash passwords before inserting users
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  // Insert users into database
  const insertedUsers = await User.insertMany(hashedUsers, { ordered: false });

  const tasksWithAssignees = tasks.map((task) => {
    const user = randomItem([...insertedUsers, null]);
    return { ...task, assignedTo: user ? user._id : null };
  });

  await Task.insertMany(tasksWithAssignees, { ordered: false });

  console.log("🌱 Database has been seeded!");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
