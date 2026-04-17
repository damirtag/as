import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GET_USERS } from "./users.documents";
import type {
  GetUsersQuery,
  GetUsersQueryVariables,
  PaginationInput,
} from "@/shared/lib";

const DEFAULT_LIMIT = 20;

export function useUsers(
  pagination: PaginationInput = { page: 1, limit: DEFAULT_LIMIT },
) {
  const { data, loading, error, fetchMore, networkStatus, refetch } = useQuery<
    GetUsersQuery,
    GetUsersQueryVariables
  >(GET_USERS, {
    variables: { pagination },
    notifyOnNetworkStatusChange: true,
  });

  const result = data?.findPaginatedUserType;
  const users = result?.items ?? [];
  const hasNextPage = result ? result.page < result.totalPages : false;

  const loadMore = () => {
    if (!hasNextPage || loading) return;

    fetchMore({
      variables: {
        pagination: {
          page: (result?.page ?? 1) + 1,
          limit: pagination.limit ?? DEFAULT_LIMIT,
        },
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) return prev;

        return {
          findPaginatedUserType: {
            ...fetchMoreResult.findPaginatedUserType,
            items: [
              ...prev.findPaginatedUserType.items,
              ...fetchMoreResult.findPaginatedUserType.items,
            ],
          },
        };
      },
    });
  };

  return {
    users,
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    hasNextPage,

    loading: loading && networkStatus === NetworkStatus.loading,
    loadingMore: networkStatus === NetworkStatus.fetchMore,
    error,

    loadMore,
    refetch,
  };
}
