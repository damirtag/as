import { gql } from "@apollo/client";

export const REACT_TO_QUOTE = gql`
  mutation ReactToQuote($input: CreateReactionInput!) {
    createReactionTypeGql(input: $input) {
      id
      type
      quoteId
      userId
    }
  }
`;

export const DELETE_REACTION = gql`
  mutation DeleteReaction($id: ID!) {
    deleteReactionTypeGql(id: $id)
  }
`;
