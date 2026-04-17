import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($quoteId: ID!, $pagination: PaginationInput) {
    findOneQuoteType(id: $quoteId) {
      commentsPaginated(pagination: $pagination) {
        total
        page
        totalPages
        items {
          id
          text
          userId
          createdAt
        }
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createCommentType(input: $input) {
      id
      text
      userId
      createdAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteCommentType(id: $id)
  }
`;
