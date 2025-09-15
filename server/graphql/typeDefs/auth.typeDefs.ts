export default `#graphql
  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    registerUser(
      name: String,
      email: String!,
      password: String!,
    ): AuthPayload
    loginUser(
      email: String!,
      password: String!,
    ): AuthPayload
    logoutUser: Boolean
  }
`;
