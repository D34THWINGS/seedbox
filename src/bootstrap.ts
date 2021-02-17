import { Services } from './services'
import { findAllTorrents } from './repositories/torrentsRepository'
import { getTorrentLinkFromSource } from './helpers/torrents'

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
