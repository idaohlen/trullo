export default `#graphql
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
    user: User
  }

  type Query {
    task(id: ID!): Task
    tasks: [Task]
  }

  type Mutation {
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
