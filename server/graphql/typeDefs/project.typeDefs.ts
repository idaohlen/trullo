export default `#graphql
  type Query {
    project(id: ID!):  Project  @auth @member
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
    ): Project @auth @owner

    deleteProject(id: ID!): Boolean @auth @owner
    
    addProjectMember(projectId: ID!, userId: ID!): Project @auth @owner(arg: "projectId")
    removeProjectMember(projectId: ID!, userId: ID!): Project @auth @owner(arg: "projectId")
    leaveProject(projectId: ID!): Project @auth @member(arg: "projectId")
    joinProject(projectId: ID!): Project @auth
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

  type PaginatedProjects {
    items: [Project!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }
`;
