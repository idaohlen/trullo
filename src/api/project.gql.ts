import { gql } from "@apollo/client/core";

export const GET_PROJECT =  gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($page: Int, $limit: Int, $search: String) {
    projects(page: $page, limit: $limit, search: $search) {
      items {
        id 
        title 
        description 
        ownerId
        owner {
          name
          email
        }
        members
        membersList {
          id
          name
          email
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const GET_MY_PROJECTS = gql`
  query GetMyProjects($page: Int, $limit: Int) {
    myProjects(page: $page, limit: $limit) {
      items {
        id 
        title 
        description 
        membersList {
          id
          name
          email
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject(
    $title: String!
    $description: String
    $ownerId: ID!
    $members: [ID]
  ) {
    addProject(
      title: $title
      description: $description
      ownerId: $ownerId
      members: $members
    ) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $title: String
    $description: String
    $ownerId: ID
    $members: [ID]
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      ownerId: $ownerId
      members: $members
    ) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
    }
  }
`;

export const ADD_PROJECT_MEMBER = gql`
  mutation AddProjectMember($projectId: ID!, $userId: ID!) {
    addProjectMember(projectId: $projectId, userId: $userId) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
    }
  }
`;

export const REMOVE_PROJECT_MEMBER = gql`
  mutation RemoveProjectMember($projectId: ID!, $userId: ID!) {
    removeProjectMember(projectId: $projectId, userId: $userId) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
    }
  }
`;

export const LEAVE_PROJECT = gql`
  mutation LeaveProject($projectId: ID!) {
    leaveProject(projectId: $projectId) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
    }
  }
`;

export const JOIN_PROJECT = gql`
  mutation JoinProject($projectId: ID!) {
    joinProject(projectId: $projectId) {
      id
      title
      description
      ownerId
      members
      membersList {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
