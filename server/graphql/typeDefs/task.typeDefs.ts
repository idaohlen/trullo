export default `#graphql
  type Query {
    task(id: ID!):                 Task          @auth
    tasks:                        [Task]         @auth(role: "ADMIN")
    projectTasks(projectId: ID!): [Task]         @auth
    myTasks:                      [Task]         @auth
    taskStatusValues:             [TaskStatus!]!
  }

  type Mutation {
    addTask(
      title: String!
      description: String
      status: TaskStatus
      assignedTo: ID
      projectId: ID!
    ): Task @auth

    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      assignedTo: ID
    ): Task @auth

    deleteTask(id: ID!): Boolean @auth
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
    projectId: ID
    project: Project
  }
`;
