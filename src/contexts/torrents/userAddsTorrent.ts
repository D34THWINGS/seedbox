import { Services } from '../../services'
import { createOrUpdateTorrent } from '../../repositories/torrentsRepository'
import { TorrentSource } from '../../services/databaseService'
import { getTorrentLinkFromSource } from '../../helpers/torrents'

export const UserAddsTorrent = async (
  services: Services,
  source: TorrentSource
) => {
  const user = services.authentication.getAuthenticatedUser()

  const infoHash = services.torrents.addTorrent(
    getTorrentLinkFromSource(source)
  )

  return createOrUpdateTorrent(services.database, {
    createdBy: user._id,
    source,
    infoHash,
  })
}
