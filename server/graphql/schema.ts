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
    task(id: ID!): Task
    tasks: [Task]
  }
  # type Mutation {}
`;
