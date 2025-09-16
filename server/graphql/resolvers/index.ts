import { type GraphQLFieldResolver } from "graphql";
import { requireAuth } from "../utils/requireAuth.js";
import { userResolvers as user, userTypeResolvers } from "./user.resolvers.js";
import { taskResolvers as task, taskTypeResolvers } from "./task.resolvers.js";
import { auth } from "../utils/auth.js";

// Helper function to help add multiple middleware functions to a resolver
// Example usage:
// someResolver: compose(requireAuth, requireAdmin, logAccess)(actualResolver),

type Resolver = GraphQLFieldResolver<any, any, any>;
type Middleware = (next: Resolver) => Resolver;

function compose(
  ...middlewares: Middleware[]
): (resolver: Resolver) => Resolver {
  return (resolver: Resolver) =>
    middlewares.reduceRight((next, mw) => mw(next), resolver);
}

// type Middleware<TSource = any, TContext = any, TArgs = any, TResult = any> =
//   (next: GraphQLFieldResolver<TSource, TContext, TArgs>) => GraphQLFieldResolver<TSource, TContext, TArgs>;

// function compose<TSource = any, TContext = any, TArgs = any, TResult = any>(
//   ...middlewares: Array<Middleware<TSource, TContext, TArgs, TResult>>
// ): (resolver: GraphQLFieldResolver<TSource, TContext, TArgs, TResult>) => GraphQLFieldResolver<TSource, TContext, TArgs, TResult> {
//   return middlewares.reduceRight(
//     (next, mw) => mw(next)
//   );
// }

// function compose(...middlewares) {
//   return middlewares.reduceRight((next, mw) => mw(next));
// }

export default {
  Query: {
    /* USERS */
    users: requireAuth(user.getMany),
    user: requireAuth(user.getById),
    me: requireAuth(user.me),
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
