import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    findOneUserType(id: $id) {
      id
      username
      name
      role
      createdAt
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
