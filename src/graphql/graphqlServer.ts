import { Application } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { Services } from '../services'
import { userQueriesResolvers } from './users/resolvers/userQueriesResolvers'
import { GraphQLContext } from './graphqlTypes'

export const GRAPHQL_PATH = '/api/graphql'

export const makeGraphQlServer = async (
  services: Services,
  httpServer: Application
) => {
  const resolvers = {
    Query: {
      ...userQueriesResolvers,
    },
  }

  const schema = await loadSchema('**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    context: (): GraphQLContext => ({
      auth: {
        user: services.authentication.getAuthenticatedUser(),
      },
    }),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  })

  server.applyMiddleware({ app: httpServer, path: GRAPHQL_PATH })

  return server
}
