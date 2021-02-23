import { Services } from './services'
import { findAllTorrents } from './repositories/torrentsRepository'
import { getTorrentLinkFromSource } from './helpers/torrents'
import {
  GQLResolversParentTypes,
  GQLSubscriptionResolvers,
  SubscriptionResolver,
} from './graphql/schemaTypes'
import { GraphQLContext } from './graphql/graphqlTypes'
import { PubSubEventMap } from './services/pubSubService'

type MapperCheck<
  T extends Record<
    string,
    {
      [K in keyof GQLSubscriptionResolvers]: NonNullable<
        GQLSubscriptionResolvers[K]
      > extends SubscriptionResolver<
        infer ReturnType,
        K,
        GQLResolversParentTypes['Subscription'],
        GraphQLContext
      >
        ? ReturnType
        : unknown
    }
  >
> = T

// This type has no use, it only check that we don't do anything stupid in pudb sub schema
export type EnsurePubSubEventsMatchSchema = MapperCheck<PubSubEventMap>

export const bootstrapServer = async (services: Services) => {
  services.logger.info('Bootstrapping server')

  const torrents = await findAllTorrents(services.database)
  if (torrents.length > 0) {
    torrents.forEach((torrent) =>
      services.torrents.addTorrent(getTorrentLinkFromSource(torrent.source))
    )
    services.logger.info(`${torrents.length} torrents restored`)
  }
}
