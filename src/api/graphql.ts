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

export const ADD_TASK = gql`
  mutation AddTask ($title: String!, $description: String) {
    addTask(title: $title, description: $description) {
      title
      description
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
    }
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

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser
  }
`;
