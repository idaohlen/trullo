export default `#graphql
  enum Role {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: Role!
    createdAt: String
    updatedAt: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
    me: User
    roles: [Role]
  }

  type Mutation {
    updateUser(
      id: ID!,
      name: String,
      email: String,
      password: String,
    ): User

    updateUserRole(
      userId: ID!
      role: Role!
    ): User
    
    deleteUser(id: ID!): Boolean
  }
`;
