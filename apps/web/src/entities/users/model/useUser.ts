import { useQuery } from "@apollo/client/react";
import { GET_USER } from "./users.documents";
import type { GetUserQuery, GetUserQueryVariables } from "@/shared/lib";

export function useUser(username: string) {
  const { data, loading, error, refetch } = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(GET_USER, {
    variables: { username },
    skip: !username,
  });

  return {
    user: data?.findByUsername ?? null,
    loading,
    error,
    refetch,
  };
}
