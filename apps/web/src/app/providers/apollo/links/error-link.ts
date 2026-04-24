import { ErrorLink } from "@apollo/client/link/error";
import { Observable } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { refreshTokens } from "@/shared/lib";
import { setAccessToken } from "@/shared/auth/token-store";

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const isUnauthenticated = error.errors.some(
    (e) => e.extensions?.code === "UNAUTHENTICATED",
  );

  if (!isUnauthenticated) return;

  return new Observable((observer) => {
    const retryRequest = () => {
      forward(operation).subscribe({
        next: (result) => observer.next(result),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    };

    if (!isRefreshing) {
      isRefreshing = true;

      refreshTokens()
        .then((res) => {
          setAccessToken(res.accessToken);
          resolvePendingRequests();
          retryRequest();
        })
        .catch((err) => {
          setAccessToken(null);
          window.location.href = "/login";
          observer.error(err);
        })
        .finally(() => {
          isRefreshing = false;
        });

      return;
    }

    // остальные ждут refresh
    pendingRequests.push(() => retryRequest());
  });
});
