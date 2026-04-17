import { gql } from "@apollo/client";

export const GET_FEED = gql`
  query GetFeed($pagination: PaginationInput!) {
    findPaginatedQuoteType(pagination: $pagination) {
      total
      page
      totalPages
      items {
        id
        text
        createdAt
        userId
        reactionsSummary {
          totalCount
          counts {
            type
            count
          }
        }
        commentsPaginated {
          items {
            createdAt
            id
            quoteId
            text
            updatedAt
            userId
          }
        }
      }
    }
  }
`;

export const GET_QUOTE = gql`
  query GetQuote($id: ID!) {
    findOneQuoteType(id: $id) {
      id
      text
      createdAt
      userId
      reactionsSummary {
        totalCount
        counts {
          type
          count
        }
      }
      commentsPaginated {
        items {
          createdAt
          id
          quoteId
          text
          updatedAt
          userId
        }
      }
    }
  }
`;

export const GET_QUOTES_BY_USER = gql`
  query GetQuotesByUser($userId: ID!, $pagination: PaginationInput) {
    findQuotesByUserId(userId: $userId, pagination: $pagination) {
      total
      page
      totalPages
      items {
        id
        text
        createdAt
      }
    }
  }
`;

export const CREATE_QUOTE = gql`
  mutation CreateQuote($input: CreateQuoteInput!) {
    createQuoteType(input: $input) {
      id
      text
      createdAt
      userId
    }
  }
`;

export const DELETE_QUOTE = gql`
  mutation DeleteQuote($id: ID!) {
    deleteQuoteType(id: $id)
  }
`;
