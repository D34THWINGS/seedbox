import { Services } from '../../services'
import { NotFoundError } from '../../helpers/errors'
import { DocumentId } from '../../services/database/databaseSchema'

export const UserPausesOrResumesTorrent = async (
  services: Services,
  torrentId: DocumentId,
  paused: boolean
) => {
  const torrent = await services.loaders.torrentLoader.load(torrentId)
  if (!torrent) {
    throw new NotFoundError('Torrent not found')
  }

  services.torrents.pauseOrResumeTorrent(torrent.infoHash, paused)

  return torrent
}
