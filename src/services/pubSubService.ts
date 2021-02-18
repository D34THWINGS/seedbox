import { PubSub } from 'apollo-server-express'
import { Awaited } from '../helpers/types'
import { Torrent } from './database/databaseSchema'
import { TorrentInfo } from './torrents/torrentTypes'

export type PubSubEventMap = {
  TORRENT_ADDED: {
    torrentAdded: Torrent
  }
  TORRENTS_PROGRESSED: {
    torrentsProgressed: TorrentInfo[]
  }
}

export const makePubSubService = () => {
  const pubSub = new PubSub()

  return {
    publishEvent: <T extends keyof PubSubEventMap>(
      eventType: T,
      eventData: PubSubEventMap[T]
    ) => pubSub.publish(eventType, eventData),
    makeSubscriber: <T extends keyof PubSubEventMap>(eventType: T) => () =>
      pubSub.asyncIterator<PubSubEventMap[T]>(eventType),
  }
}

export type PubSubService = Awaited<ReturnType<typeof makePubSubService>>
