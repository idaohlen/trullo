export default `#graphql
  enum TaskStatus {
    TO_DO
    IN_PROGRESS
    BLOCKED
    DONE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    name: String
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
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
    user: User
  }

  type Query {
    user(id: ID!): User
    users: [User]
    task(id: ID!): Task
    tasks: [Task]
  }

  type Mutation {
    # AUTH
    registerUser(
      name: String,
      email: String!,
      password: String!,
    ): AuthPayload
    loginUser(
      email: String!,
      password: String!,
    ): AuthPayload

    # USERS
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
