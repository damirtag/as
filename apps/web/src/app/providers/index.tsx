import { ApolloAppProvider } from "./apollo";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <ApolloAppProvider>{children}</ApolloAppProvider>;
};
