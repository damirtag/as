import { useQuery } from "@apollo/client/react";
import { GET_QUOTES_BY_USER } from "./quotes.documents";
import type {
  GetQuotesByUserQuery,
  GetQuotesByUserQueryVariables,
} from "@/shared/lib/api";

export function useQuoteByUserId(userId: string) {
  const { data, loading, error, refetch } = useQuery<
    GetQuotesByUserQuery,
    GetQuotesByUserQueryVariables
  >(GET_QUOTES_BY_USER, {
    variables: { userId },
    skip: !userId,
  });

  return {
    quotes: data?.findQuotesByUserId?.items ?? [],
    loading,
    error,
    refetch,
  };
}