import { createServer } from 'http'
import { Application } from 'express'
import { ApolloServer, UserInputError } from 'apollo-server-express'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { forbidden } from '@hapi/boom'
import { Services } from '../services'
import { verifyTokenSync } from '../helpers/authentication'
import { getTokenFromCookie } from '../helpers/http'
import { GraphQLContext } from './graphqlTypes'
import { userQueriesResolvers } from './users/resolvers/userQueriesResolvers'
import { torrentMutationsResolvers } from './torrents/resolvers/torrentMutationsResolvers'
import { torrentQueriesResolvers } from './torrents/resolvers/torrentQueriesResolvers'
import {
  Torrent,
  TorrentInfo,
} from './torrents/resolvers/torrentTypesResolvers'
import { GQLResolvers } from './schemaTypes'
import { makeTorrentSubscriptionsResolvers } from './torrents/resolvers/torrentSubscriptionsResolvers'

export const GRAPHQL_PATH = '/api/graphql'
export const GRAPHQL_SUBSCRIPTIONS_PATH = '/api/graphql/subscriptions'

export const makeGraphQlServer = async (
  services: Services,
  app: Application
) => {
  const resolvers: GQLResolvers = {
    Query: {
      ...userQueriesResolvers,
      ...torrentQueriesResolvers,
    },
    Mutation: {
      ...torrentMutationsResolvers,
    },
    Subscription: {
      ...makeTorrentSubscriptionsResolvers(services),
    },
    Torrent,
    TorrentInfo,
  }

  const schema = await loadSchema('**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
    resolvers: resolvers as never,
  })

  const server = new ApolloServer({
    schema,
    debug: true,
    logger: services.logger,
    plugins: [
      {
        requestDidStart(ctx) {
          if (!ctx.request.operationName) {
            throw new UserInputError('Missing operation name')
          }

          services.logger.info(
            `GQL ${ctx.request.query?.replace(/[\s\n]+/g, ' ')}`
          )
        },
      },
    ],
    context: (): GraphQLContext => ({ services }),
    playground: {
      subscriptionEndpoint: GRAPHQL_SUBSCRIPTIONS_PATH,
      settings: {
        'request.credentials': 'include',
      },
    },
    subscriptions: {
      path: GRAPHQL_SUBSCRIPTIONS_PATH,
      onConnect: (_, websocket) => {
        const token = getTokenFromCookie(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          websocket.upgradeReq.headers.cookie,
          services.config.COOKIE_NAME,
          services.config.COOKIE_SECRET
        )

        if (!token) {
          throw forbidden()
        }

        const { userId } = verifyTokenSync(services, token)
        services.authentication.injectSession(
          services.database.generateId(userId)
        )
      },
    },
  })

  server.applyMiddleware({ app, path: GRAPHQL_PATH })

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)

  return httpServer
}
