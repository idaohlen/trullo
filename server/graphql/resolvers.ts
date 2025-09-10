import Task from "../models/Task.js";

export default {
  Query: {
    task: async (_: unknown, { id }: {id: string}) => Task.findById(id),
    tasks: async (_: unknown) => Task.find({}),
  },
  // Mutation: {}
}
