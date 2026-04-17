import { useQuery } from "@apollo/client/react";
import { GET_USER } from "./users.documents";
import type { GetUserQuery, GetUserQueryVariables } from "@/shared/lib";

export function useUser(id: string) {
  const { data, loading, error, refetch } = useQuery<
    GetUserQuery,
    GetUserQueryVariables
  >(GET_USER, {
    variables: { id },
    skip: !id,
  });

  return {
    user: data?.findOneUserType ?? null,
    loading,
    error,
    refetch,
  };
}
