import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./client";

type Props = {
  children: React.ReactNode;
};

export const ApolloAppProvider = ({ children }: Props) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
