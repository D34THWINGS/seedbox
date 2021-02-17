import { Services } from '../../services'
import { NotFoundError } from '../../helpers/errors'

export const UserPausesOrResumesTorrent = async (
  services: Services,
  torrentId: string,
  paused: boolean
) => {
  const torrent = await services.loaders.torrentLoader.load(
    services.database.generateId(torrentId)
  )
  if (!torrent) {
    throw new NotFoundError('Torrent not found')
  }

  services.torrents.pauseOrResumeTorrent(torrent.infoHash, paused)

  return torrent
}
