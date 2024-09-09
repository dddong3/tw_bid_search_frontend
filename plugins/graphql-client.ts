import { GraphQLClient } from 'graphql-request';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const client = new GraphQLClient(runtimeConfig.public.backendApiUrl + '/query');

  return {
    provide: {
      graphql: client
    }
  };
});