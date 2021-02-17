import { Services } from '../../services'
import { NotFoundError } from '../../helpers/errors'
import { DocumentId } from '../../services/databaseService'

export const UserGetsTorrentFiles = async (
  services: Services,
  torrentId: DocumentId
) => {
  const torrent = await services.loaders.torrentLoader.load(torrentId)
  if (!torrent) {
    throw new NotFoundError('Torrent not found')
  }

  return services.torrents.listTorrentFiles(torrent.infoHash)
}
