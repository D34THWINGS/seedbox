import { Services } from '../../services'
import { NotFoundError } from '../../helpers/errors'

export const UserGetsTorrentFiles = async (
  services: Services,
  torrentId: string
) => {
  const torrent = await services.loaders.torrentLoader.load(
    services.database.generateId(torrentId)
  )
  if (!torrent) {
    throw new NotFoundError('Torrent not found')
  }

  return services.torrents.listTorrentFiles(torrent.infoHash)
}
