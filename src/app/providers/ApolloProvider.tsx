"use client";
import React from "react";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Cookies from "js-cookie";

const authLink = setContext(() => {
  const accessToken = Cookies.get("accessToken") as string;
  const cleanedJwt = accessToken.replace(/"/g, "");
  return {
    headers: {
      Authorization: cleanedJwt as string,
    },
  };
});

export const classlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/classroom",
});

export const assignmentlink = createHttpLink({
  uri: "http://localhost:4000/assignment",
});

export const submissionlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/submission",
});

export const classClient = new ApolloClient({
  link: authLink.concat(classlink),
  cache: new InMemoryCache(),
});

export const assignmentClient = new ApolloClient({
  link: authLink.concat(assignmentlink),
  cache: new InMemoryCache({
    addTypename: false
  }),
});

export const submissionClient = new ApolloClient({
  link: submissionlink,
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={classClient}>{children}</ApolloProvider>
);

export default ApolloWrapper;
