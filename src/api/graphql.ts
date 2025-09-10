import { gql } from "@apollo/client/core";

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
      email
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      _id
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
      _id
      title
      description
      status
      assignedTo {
        _id
        name
        email
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
      _id
      title
      description
      status
      assignedTo {
        _id
        name
        email
      }
      createdAt
      updatedAt
      finishedAt
    }
  }
`;
