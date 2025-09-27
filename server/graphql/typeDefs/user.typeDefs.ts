export default `#graphql
  type Query {
    user(id: ID!): User @auth
    users(page: Int, limit: Int, search: String): PaginatedUsers @auth
    me: User @auth
    roles: [Role]
  }

  type Mutation {
    updateUser(
      id: ID!
      name: String
      email: String
      password: String
      currentPassword: String
    ): User @auth(role: "ADMIN", allowSelf: true, selfArg: "id")

    updateUserRole(
      userId: ID!
      role: Role!
    ): User @auth @admin
    
    deleteUser(id: ID!): Boolean @auth(role: "ADMIN", allowSelf: true, selfArg: "id")
  }

  enum Role {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    # password: String!
    role: Role!
    createdAt: String
    updatedAt: String
  }

  type PaginatedUsers {
    items: [User!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }
`;
