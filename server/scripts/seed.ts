import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import projects from "./seed-data/projects.js";

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
  }
  await mongoose.connect(MONGO_URI);
  console.log("Connected:", MONGO_URI);

  // Purge the database
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
  ]);

  // Collect all unique users from all projects
  const allUsers = new Map();
  
  for (const proj of projects) {
    // Add owner
    allUsers.set(proj.owner.email, proj.owner);
    
    // Add members
    for (const member of proj.members) {
      allUsers.set(member.email, member);
    }
  }

  // Hash passwords and create users in bulk
  const usersToCreate = await Promise.all(
    Array.from(allUsers.values()).map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  console.log(`Creating ${usersToCreate.length} users...`);
  let createdUsers;
  try {
    createdUsers = await User.insertMany(usersToCreate, { ordered: false });
    console.log(`✅ Successfully created ${createdUsers.length} users`);
  } catch (error) {
    console.error("❌ Error creating users:", error);
    throw error;
  }
  
  // Create user lookup map by email
  const userLookup = new Map();
  createdUsers.forEach(user => {
    userLookup.set(user.email, user);
  });

  // Prepare projects for bulk insert
  const projectsToCreate = [];
  const projectUserMap: { tasks: any[]; allUsers: any[] }[] = []; // Track project-user relationships for tasks
  
  for (const proj of projects) {
    const owner = userLookup.get(proj.owner.email);
    const memberUsers = proj.members.map(m => userLookup.get(m.email));
    
    const projectData = {
      title: proj.title,
      description: proj.description,
      ownerId: owner._id,
      members: memberUsers.map(u => u._id),
    };
    
    projectsToCreate.push(projectData);
    projectUserMap.push({
      tasks: proj.tasks,
      allUsers: [owner, ...memberUsers]
    });
  }

  console.log(`Creating ${projectsToCreate.length} projects...`);
  let createdProjects;
  try {
    createdProjects = await Project.insertMany(projectsToCreate, { ordered: false });
    console.log(`✅ Successfully created ${createdProjects.length} projects`);
  } catch (error) {
    console.error("❌ Error creating projects:", error);
    throw error;
  }

  // Prepare tasks for bulk insert
  const tasksToCreate: Array<{
    title: string;
    description: string;
    status: string;
    projectId: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
  }> = [];
  
  createdProjects.forEach((project, index) => {
    const { tasks, allUsers } = projectUserMap[index];
    
    for (const task of tasks) {
      // Assign random member as assignee
      const assignee = randomItem(allUsers);
      
      tasksToCreate.push({
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: project._id,
        assignedTo: assignee._id,
      });
    }
  });

  console.log(`Creating ${tasksToCreate.length} tasks...`);
  try {
    await Task.insertMany(tasksToCreate, { ordered: false });
    console.log(`✅ Successfully created ${tasksToCreate.length} tasks`);
  } catch (error) {
    console.error("❌ Error creating tasks:", error);
    throw error;
  }

  console.log("🌱 Database has been seeded!");
  console.log(`📊 Created: ${createdUsers.length} users, ${createdProjects.length} projects, ${tasksToCreate.length} tasks`);
  
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
