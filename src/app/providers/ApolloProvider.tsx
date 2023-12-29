'use client'
import React from "react";
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from '@apollo/client/link/context'; // Correct import

import Cookies from "js-cookie";

const authLink = setContext(() => {
  const accessToken = Cookies.get('accessToken') as string;
  return {
    headers: {
      Authorization: accessToken ? accessToken : '', // Add Bearer prefix
    },
  };
});

export const classlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/classroom",
});

export const assignmentlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/assignment",
});

export const classClient = new ApolloClient({
  link: authLink.concat(classlink),
  cache: new InMemoryCache(),
});

export const assignmentClient = new ApolloClient({
  link: assignmentlink,
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={classClient}>
    {children}
  </ApolloProvider>
);

export default ApolloWrapper;
