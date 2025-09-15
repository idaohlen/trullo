export default `#graphql
  type User {
    id: ID!
    name: String
    email: String!
    password: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
    me: User
  }

  type Mutation {
    updateUser(
      id: ID!,
      name: String,
      email: String,
      password: String,
    ): User
    deleteUser(id: ID!): Boolean
  }
`;
