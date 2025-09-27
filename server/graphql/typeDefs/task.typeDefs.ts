export default `#graphql
  type Query {
    task(id: ID!): Task @auth
    tasks(page: Int, limit: Int): PaginatedTasks @auth @admin
    projectTasks(
      projectId: ID!, 
      page: Int,
      limit: Int):
      PaginatedTasks @auth
    myTasks(page: Int, limit: Int): PaginatedTasks @auth
    taskStatusValues: [TaskStatus!]!
  }

  type Mutation {
    addTask(
      title: String!
      description: String
      status: TaskStatus
      assignedTo: ID
      projectId: ID!
    ): Task @auth @member(arg: "projectId")

    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      assignedTo: ID
    ): Task @auth @memberOrAdmin(arg: "projectId")

    deleteTask(id: ID!): Boolean @auth @ownerOrAdmin
  }
  
  enum TaskStatus {
    TO_DO
    IN_PROGRESS
    BLOCKED
    DONE
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    createdAt: String
    updatedAt: String
    finishedAt: String
    assignedTo: ID
    assignee: User
    finishedBy: ID
    finisher: User
    projectId: ID
    project: Project
  }

  type PaginatedTasks {
    items: [Task!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }
`;
