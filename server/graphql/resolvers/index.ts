import { userResolvers as user, userTypeResolvers } from "./user.resolvers.js";
import { taskResolvers as task, taskTypeResolvers } from "./task.resolvers.js";
import { auth } from "../utils/auth.js";
// Replaced by schema directive
// import { requireAuth, requireAdmin, requireSelfOrAdmin } from "../utils/requireAuth.js";

// import { compose } from "../utils/resolvers.js";

export default {
  Query: {
    /* USERS */
    users: user.getMany,
    user: user.getById,
    me: user.me,
    roles: user.getRoles.bind(task),
    /* TASKS */
    tasks: task.getMany,
    task: task.getById,
    taskStatusValues: task.getStatusValues.bind(task)
  },

  Mutation: {
    /* AUTH */
    registerUser: auth.registerUser,
    loginUser: auth.loginUser,
    logoutUser: auth.logoutUser,

    /* USERS */
    updateUser: user.update,
    deleteUser: user.delete,
    updateUserRole: user.updateRole,

    /* TASKS */
    addTask: task.create,
    updateTask: task.update,
    deleteTask: task.delete,
  },

  User: userTypeResolvers,
  Task: taskTypeResolvers,
};
