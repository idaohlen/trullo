import { gql } from "@apollo/client/core";

export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $search: String) {
    users(page: $page, limit: $limit, search: $search) {
      items {
        id
        name
        email
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
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
