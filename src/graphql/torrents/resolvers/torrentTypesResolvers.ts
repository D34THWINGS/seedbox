import { ResolverObject } from '../../graphqlTypes'
import { Torrent as DBTorrent } from '../../../services/databaseService'
import { GQLTorrent, GQLTorrentInfo } from '../../schemaTypes'
import { serialize } from '../../../helpers/serialization'

export const Torrent: ResolverObject<DBTorrent, GQLTorrent> = {
  info: (torrent, _, { services }) =>
    services.torrents.getTorrent(torrent.infoHash),

  creator: async (torrent, _, { services }) =>
    serialize(await services.loaders.userLoader.load(torrent.createdBy)),
}

export const TorrentInfo: ResolverObject<GQLTorrentInfo, GQLTorrentInfo> = {
  files: async (torrentInfo, _, { services }) => {
    const listTorrentFiles = services.torrents.listTorrentFiles(torrentInfo.id)
    console.log(listTorrentFiles)
    return listTorrentFiles
  },
}
