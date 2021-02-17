import { Application } from 'express'
import { ApolloServer, UserInputError } from 'apollo-server-express'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { Services } from '../services'
import { GraphQLContext } from './graphqlTypes'
import { userQueriesResolvers } from './users/resolvers/userQueriesResolvers'
import { torrentMutationsResolvers } from './torrents/resolvers/torrentMutationsResolvers'
import { torrentQueriesResolvers } from './torrents/resolvers/torrentQueriesResolvers'
import {
  Torrent,
  TorrentInfo,
} from './torrents/resolvers/torrentTypesResolvers'

export const GRAPHQL_PATH = '/api/graphql'

export const makeGraphQlServer = async (
  services: Services,
  httpServer: Application
) => {
  const resolvers = {
    Query: {
      ...userQueriesResolvers,
      ...torrentQueriesResolvers,
    },
    Mutation: {
      ...torrentMutationsResolvers,
    },
    Torrent,
    TorrentInfo,
  }

  const schema = await loadSchema('**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
    resolvers,
  })

  const server = new ApolloServer({
    schema,
    debug: true,
    logger: services.logger,
    plugins: [
      {
        requestDidStart(ctx) {
          if (!ctx.request.operationName) {
            throw new UserInputError('Missing operaton name')
          }

          services.logger.info(
            `GQL ${ctx.request.query?.replace(/[\s\n]+/g, ' ')}`
          )
        },
      },
    ],
    context: (): GraphQLContext => ({
      services,
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
