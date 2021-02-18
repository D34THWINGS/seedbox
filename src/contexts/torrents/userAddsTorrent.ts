import { Services } from '../../services'
import { createOrUpdateTorrent } from '../../repositories/torrentsRepository'
import { TorrentSource } from '../../services/database/databaseSchema'
import { getTorrentLinkFromSource } from '../../helpers/torrents'

export const UserAddsTorrent = async (
  services: Services,
  source: TorrentSource
) => {
  const user = await services.authentication.getAuthenticatedUser()

  const infoHash = services.torrents.addTorrent(
    getTorrentLinkFromSource(source)
  )

  const addedTorrent = await createOrUpdateTorrent(services.database, {
    createdBy: user._id,
    source,
    infoHash,
  })

  await services.pubSub.publishEvent('TORRENT_ADDED', {
    torrentAdded: addedTorrent,
  })

  return addedTorrent
}
