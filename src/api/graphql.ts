import { gql } from "@apollo/client/core";

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      _id
      title
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      _id
      title
    }
  }
`;
