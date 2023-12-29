'use client'
import React from "react";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

export const classlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/classroom",
});

export const assignmentlink = createHttpLink({
  uri: "https://www.digitalcampus.shop/assignment",
});

export const classClient = new ApolloClient({
  link: classlink,
  cache: new InMemoryCache(),
});

export const assignmentClient = new ApolloClient({
  link: assignmentlink,
  cache: new InMemoryCache(),
});



export default ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={classClient}>
    {children}
  </ApolloProvider>
);
