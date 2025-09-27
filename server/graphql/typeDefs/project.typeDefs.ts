export default `#graphql
  type Query {
    project(id: ID!): Project @auth @memberOrAdmin
    projects(page: Int, limit: Int, search: String): PaginatedProjects @auth
    myProjects(page: Int, limit: Int): PaginatedProjects @auth
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
    ): Project @auth @ownerOrAdmin

    deleteProject(id: ID!): Boolean @auth @ownerOrAdmin
    
    addProjectMember(projectId: ID!, userId: ID!): Project @auth @ownerOrAdmin(arg: "projectId")
    removeProjectMember(projectId: ID!, userId: ID!): Project @auth @ownerOrAdmin(arg: "projectId")
    leaveProject(projectId: ID!): Project @auth @member(arg: "projectId")
    joinProject(projectId: ID!): Project @auth
  }

  type Project {
    id: ID!
    title: String!
    description: String
    ownerId: ID!
    owner: User
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
