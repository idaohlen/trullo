import { gql } from "@apollo/client/core";

export const GET_TASK_STATUS_VALUES = gql`
  query GetTaskStatusValues {
    taskStatusValues
  }
`;

export const GET_TASKS = gql`
  query GetTasks($page: Int, $limit: Int) {
    tasks(page: $page, limit: $limit) {
      items {
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
        finisher {
          id
          name
          email
        }
        projectId
        createdAt
        updatedAt
        finishedAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`;

export const GET_PROJECT_TASKS = gql`
  query GetProjectTasks($projectId: ID!, $page: Int, $limit: Int) {
    projectTasks(projectId: $projectId, page: $page, limit: $limit) {
      items {
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
        finisher {
          id
          name
          email
        }
        projectId
        createdAt
        updatedAt
        finishedAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
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
      finisher {
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
      finisher {
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
        id
        name
        email
      }
      finisher {
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

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
