import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { authLink } from "./links/auth-link";
import { errorLink } from "./links/error-link";
import { httpLink } from "./links/http-link";

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          findPaginatedQuoteType: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!existing || args?.pagination?.page === 1) return incoming;

              return {
                ...incoming,
                items: [...(existing.items ?? []), ...(incoming.items ?? [])],
              };
            },
          },
        },
      },

      Quote: {
        keyFields: ["id"],
      },
      User: {
        keyFields: ["id"],
      },
      Comment: {
        keyFields: ["id"],
      },
    },
  }),
});
