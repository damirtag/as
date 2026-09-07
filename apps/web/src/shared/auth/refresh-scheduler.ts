import { refreshTokens } from "@/shared/lib/api/auth";
import { getAccessTokenExpiry } from "./token-store";

// Refresh this long before the access token actually expires, so requests
// never go out with a stale/expired token.
const REFRESH_SKEW_MS = 60_000; // 1 minute

let timer: ReturnType<typeof setTimeout> | null = null;

export const clearScheduledRefresh = (): void => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

/**
 * Arms a one-shot timer that silently refreshes the access token shortly
 * before it expires. On success it re-arms itself for the next cycle, so the
 * session stays alive without ever surfacing a 401 to the user. On failure it
 * stops — the reactive errorLink + route guards handle the logout path.
 */
export const scheduleProactiveRefresh = (): void => {
  clearScheduledRefresh();

  const expiry = getAccessTokenExpiry();
  if (expiry === null) return;

  const delay = Math.max(0, expiry - Date.now() - REFRESH_SKEW_MS);

  timer = setTimeout(async () => {
    try {
      await refreshTokens();
      scheduleProactiveRefresh();
    } catch {
      clearScheduledRefresh();
    }
  }, delay);
};
