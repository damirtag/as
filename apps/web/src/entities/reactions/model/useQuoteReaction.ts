import { useMutation } from "@apollo/client/react";
import { REACT_TO_QUOTE } from "./reactions.documents";
import type {
  ReactToQuoteMutation,
  ReactToQuoteMutationVariables,
  ReactionType,
} from "@/shared/lib";

export function useQuoteReaction() {
  const [reactToQuote] = useMutation<
    ReactToQuoteMutation,
    ReactToQuoteMutationVariables
  >(REACT_TO_QUOTE);

  const react = async (
    quoteId: string,
    userId: string,
    type: ReactionType,
    refetch?: any,
  ) => {
    return reactToQuote({
      variables: {
        input: { quoteId, userId, type },
      },
      ...(refetch ? { refetchQueries: refetch } : {}),
    });
  };

  return { react };
}
