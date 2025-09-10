export default `#graphql
  enum TaskStatus {
    TO_DO
    IN_PROGRESS
    BLOCKED
    DONE
  }

  type User {
    _id: ID!
    name: String
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
  }

  type Task {
    _id: ID!
    title: String!
    description: String
    status: TaskStatus!
    createdAt: String
    updatedAt: String
    finishedAt: String
    assignedTo: User
  }

  type Query {
    user(id: ID!): User
    users: [User]
    task(id: ID!): Task
    tasks: [Task]
  }

  type Mutation {
    # USERS
    addUser(
      name: String,
      email: String!,
      password: String!,
    ): User
    updateUser(
      id: ID!,
      name: String,
      email: String,
      password: String,
    ): User
    deleteUser(id: ID!): Boolean

    # TASKS
    addTask(
      title: String!,
      description: String,
      assignedTo: ID,
    ): Task
    updateTask(
      id: ID!,
      title: String,
      description: String,
      status: TaskStatus,
      assignedTo: ID,
    ): Task
    deleteTask(id: ID!): Boolean
  }
`;
