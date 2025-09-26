import { userResolvers as user, userTypeResolvers } from "./user.resolvers.js";
import { taskResolvers as task, taskTypeResolvers } from "./task.resolvers.js";
import { projectResolvers as project, projectTypeResolvers } from "./project.resolvers.js";
import { auth } from "../utils/auth.js";
// Replaced by schema directive
// import { requireAuth, requireAdmin, requireSelfOrAdmin } from "../utils/requireAuth.js";

// import { compose } from "../utils/resolvers.js";

export default {
  Query: {
    /* USERS */
    user: user.getById,
    me: user.me,
    users: user.getMany,
    roles: user.getRoles.bind(task),

    /* PROJECTS */
    project: project.getById,
    projects: project.getMany,
    myProjects: project.getMine,

    /* TASKS */
    task: task.getById,
    tasks: task.getMany,
    myTasks: task.getMine,
    projectTasks: task.getByProject,
    taskStatusValues: task.getStatusValues.bind(task)
  },

  Mutation: {
    /* AUTH */
    registerUser: auth.registerUser,
    loginUser: auth.loginUser,
    logoutUser: auth.logoutUser,

    /* USERS */
    updateUser: user.update,
    updateUserRole: user.updateRole,
    deleteUser: user.delete,

    /* PROJECTS */
    addProject: project.create,
    updateProject: project.update,
    deleteProject: project.delete,
    addProjectMember: project.addMember,
    removeProjectMember: project.removeMember,
    joinProject: project.join,
    leaveProject: project.leave,

    /* TASKS */
    addTask: task.create,
    updateTask: task.update,
    deleteTask: task.delete,
  },

  User: userTypeResolvers,
  Project: projectTypeResolvers,
  Task: taskTypeResolvers,
};
