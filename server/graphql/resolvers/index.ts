import { requireAuth, requireAdmin, requireSelfOrAdmin } from "../utils/requireAuth.js";
import { userResolvers as user, userTypeResolvers } from "./user.resolvers.js";
import { taskResolvers as task, taskTypeResolvers } from "./task.resolvers.js";
import { auth } from "../utils/auth.js";

// Helper function to help add multiple middleware functions to a resolver
// Example usage:
// someResolver: compose(requireAuth, requireAdmin, logAccess)(actualResolver),

type AsyncResolver = (parent: any, args: any, context: any, info: any) => Promise<any>;
type Middleware = (next: AsyncResolver) => AsyncResolver;

function compose(
  ...middlewares: Middleware[]
): (resolver: AsyncResolver) => AsyncResolver {
  return (resolver: AsyncResolver) =>
    middlewares.reduceRight((next, mw) => mw(next), resolver);
}

export default {
  Query: {
    /* USERS */
    users: requireAdmin(user.getMany),
    user: requireAuth(user.getById),
    me: requireAuth(user.me),
    roles: user.getRoles.bind(task),
    /* TASKS */
    tasks: requireAuth(task.getMany),
    task: requireAuth(task.getById),
    taskStatusValues: task.getStatusValues.bind(task)
  },

  Mutation: {
    /* AUTH */
    registerUser: auth.registerUser,
    loginUser: auth.loginUser,
    logoutUser: auth.logoutUser,

    /* USERS */
    updateUser: requireSelfOrAdmin(user.update),
    deleteUser: requireSelfOrAdmin(user.delete),
    updateUserRole: requireAdmin(user.updateRole),

    /* TASKS */
    addTask: requireAuth(task.create),
    updateTask: requireAuth(task.update),
    deleteTask: requireAuth(task.delete),
  },

  User: userTypeResolvers,
  Task: taskTypeResolvers,
};
