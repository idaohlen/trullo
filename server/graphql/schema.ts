export default `#graphql

  type Task {
    _id: ID!
    title: String!
  }
  type Query {
    task(id: ID!): Task
    tasks: [Task]
  }
  # type Mutation {}
`;
