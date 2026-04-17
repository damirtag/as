import { useQuery } from "@apollo/client/react";
import { GET_QUOTE } from "./quotes.documents";
import type { GetQuoteQuery, GetQuoteQueryVariables } from "@/shared/lib/api";

export function useQuote(id: string) {
  const { data, loading, error, refetch } = useQuery<
    GetQuoteQuery,
    GetQuoteQueryVariables
  >(GET_QUOTE, {
    variables: { id },
    skip: !id,
  });

  return {
    quote: data?.findOneQuoteType ?? null,
    loading,
    error,
    refetch,
  };
}
