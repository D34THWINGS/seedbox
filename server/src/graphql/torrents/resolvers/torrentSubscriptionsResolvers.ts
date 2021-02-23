import { GQLResolvers } from '../../schemaTypes'
import { Services } from '../../../services'

export const makeTorrentSubscriptionsResolvers = (
  services: Services
): GQLResolvers['Subscription'] => ({
  torrentAdded: {
    subscribe: services.pubSub.makeSubscriber('TORRENT_ADDED'),
  },
  torrentsProgressed: {
    subscribe: services.pubSub.makeSubscriber('TORRENTS_PROGRESSED'),
  },
})
