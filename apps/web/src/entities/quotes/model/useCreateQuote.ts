import { useMutation } from "@apollo/client/react";
import { CREATE_QUOTE } from "./quotes.documents";

export function useCreateQuote() {
  const [mutate, state] = useMutation(CREATE_QUOTE, {
    update(cache, { data }) {
      if (!data) return;

      cache.modify({
        fields: {
          findPaginatedQuoteType(existing = {}) {
            return {
              ...existing,
              items: [data, ...existing.items],
              total: existing.total + 1,
            };
          },
        },
      });
    },
  });

  return {
    createQuote: mutate,
    ...state,
  };
}
