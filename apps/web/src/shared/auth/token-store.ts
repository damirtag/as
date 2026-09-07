let _accessToken: string | null = null;

export const getAccessToken = (): string | null => _accessToken;

export const setAccessToken = (token: string | null): void => {
  _accessToken = token;
};

export const clearAccessToken = (): void => {
  _accessToken = null;
};

export const hasAccessToken = (): boolean => _accessToken !== null;

/**
 * Reads the `exp` claim (ms epoch) from the current access token without
 * verifying the signature — used only to schedule a proactive refresh.
 */
export const getAccessTokenExpiry = (): number | null => {
  if (!_accessToken) return null;
  try {
    const [, payload] = _accessToken.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
};
