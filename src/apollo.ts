import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

//typePolicies update(local state)_reactive Variable
export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
        },
      },
    },
  }),
});
