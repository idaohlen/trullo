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
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      assignedTo
      user {
        name
      }
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
      user {
        name
      }
      createdAt
      updatedAt
      finishedAt
    }
  }
`;
