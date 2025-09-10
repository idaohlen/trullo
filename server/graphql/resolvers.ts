import User from "../models/User.js";
import Task from "../models/Task.js";

export default {
  Query: {
    // USERS
    user: async (_: unknown, { id }: {id: string}) => User.findById(id),
    users: async (_: unknown) => User.find({}),
    // TASKS
    task: async (_: unknown, { id }: {id: string}) => Task.findById(id),
    tasks: async (_: unknown) => Task.find({}),
  },
  // Mutation: {}
}
