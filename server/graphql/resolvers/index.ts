import { requireAuth } from "../utils/requireAuth.js";
import { userResolvers as user, userTypeResolvers } from "./user.resolvers.js";
import { taskResolvers as task, taskTypeResolvers } from "./task.resolvers.js";
import { auth } from "../utils/auth.js";

export default {
  Query: {
    /* USERS */
    users: requireAuth(user.getMany),
    user: requireAuth(user.getById),
    me: requireAuth(user.me),
    /* TASKS */
    tasks: requireAuth(task.getMany),
    task: requireAuth(task.getById),
  },

  Mutation: {
    /* AUTH */
    registerUser: auth.registerUser,
    loginUser: auth.loginUser,
    logoutUser: auth.logoutUser,

    /* USERS */
    updateUser: requireAuth(user.update),
    deleteUser: requireAuth(user.delete),

    /* TASKS */
    addTask: requireAuth(task.create),
    updateTask: requireAuth(task.update),
    deleteTask: requireAuth(task.delete),
  },

  User: userTypeResolvers,
  Task: taskTypeResolvers,
};
