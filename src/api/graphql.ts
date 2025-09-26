import { gql } from "@apollo/client/core";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $currentPassword: String
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      password: $password
      currentPassword: $currentPassword
    ) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
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

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
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

export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id 
      title 
      description 
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

export const GET_TASK_STATUS_VALUES = gql`
  query GetTaskStatusValues {
    taskStatusValues
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      assignedTo
      assignee {
        id
        name
        email
      }
      projectId
      createdAt
      updatedAt
      finishedAt
    }
  }
`;

export const GET_PROJECT_TASKS = gql`
  query GetProjectTasks($projectId: ID!) {
    projectTasks(projectId: $projectId) {
      id
      title
      description
      status
      assignedTo
      assignee {
        id
        name
        email
      }
      projectId
      createdAt
      updatedAt
      finishedAt
    }
  }
`;

export const GET_MY_TASKS = gql`
  query GeMyTasks {
    myTasks {
      id
      title
      description
      status
      assignedTo
      assignee {
        id
        name
        email
      }
      projectId
      createdAt
      updatedAt
      finishedAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      assignedTo
      assignee {
        id
        name
        email
      }
      createdAt
      updatedAt
      finishedAt
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask(
    $title: String!
    $description: String
    $status: TaskStatus
    $assignedTo: ID
    $projectId: ID!
  ) {
    addTask(
      title: $title
      description: $description
      status: $status
      assignedTo: $assignedTo
      projectId: $projectId
    ) {
      title
      description
      status
      assignedTo
      projectId
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: TaskStatus
    $assignedTo: ID
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assignedTo: $assignedTo
    ) {
      id
      title
      description
      status
      assignedTo
      assignee {
        name
      }
      projectId
      createdAt
      updatedAt
      finishedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    registerUser(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
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

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;
