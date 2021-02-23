import { GQLResolvers } from '../../schemaTypes'

export const Torrent: GQLResolvers['Torrent'] = {
  info: (torrent, _, { services }) =>
    services.torrents.getTorrent(torrent.infoHash),

  creator: async (torrent, _, { services }) =>
    await services.loaders.userLoader.load(torrent.createdBy),
}

export const TorrentInfo: GQLResolvers['TorrentInfo'] = {
  files: async (torrentInfo, _, { services }) =>
    services.torrents.listTorrentFiles(torrentInfo._id),
}
