import { GQLQueryShowTorrentFilesArgs, GQLResolvers } from '../../schemaTypes'
import { UserGetsTorrentLists } from '../../../contexts/torrents/userGetsTorrentLists'
import { UserGetsTorrentFiles } from '../../../contexts/torrents/userGetsTorrentFiles'

export const torrentQueriesResolvers: GQLResolvers['Query'] = {
  showTorrents: async (_, __, { services }) => UserGetsTorrentLists(services),

  showTorrentFiles: async (
    _,
    { torrentId }: GQLQueryShowTorrentFilesArgs,
    { services }
  ) => UserGetsTorrentFiles(services, torrentId),
}
