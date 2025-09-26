export default `#graphql
  type Query {
    project(id: ID!):  Project  @auth
    projects:         [Project] @auth
    myProjects:       [Project] @auth
  }

  type Mutation {
    addProject(
      title: String!
      description: String
      ownerId: ID!
      members: [ID]
    ): Project @auth

    updateProject(
      id: ID!
      title: String
      description: String
      ownerId: ID
      members: [ID]
    ): Project @auth

    deleteProject(id: ID!): Boolean @auth
    
    addProjectMember(projectId: ID!, userId: ID!): Project @auth
    removeProjectMember(projectId: ID!, userId: ID!): Project @auth
  }

  type Project {
    id: ID!
    title: String!
    description: String
    ownerId: ID!
    owner: [User]
    members: [ID]
    membersList: [User]
    createdAt: String
    updatedAt: String
  }
`;
