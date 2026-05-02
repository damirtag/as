import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($username: String!) {
    findByUsername(username: $username) {
      id
      username
      name
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($pagination: PaginationInput!) {
    findPaginatedUserType(pagination: $pagination) {
      total
      page
      totalPages
      items {
        id
        username
        role
        createdAt
      }
    }
  }
`;
