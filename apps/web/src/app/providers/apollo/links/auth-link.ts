import { SetContextLink } from "@apollo/client/link/context";
import { getAccessToken } from "@/shared/auth/token-store";

export const authLink = new SetContextLink((prevContext, _) => {
  const token = getAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});
