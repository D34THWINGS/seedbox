import { RootResolverObject } from '../../graphqlTypes'
import { GQLQuery, GQLQueryShowTorrentFilesArgs } from '../../schemaTypes'
import { UserGetsTorrentLists } from '../../../contexts/torrents/userGetsTorrentLists'
import { UserGetsTorrentFiles } from '../../../contexts/torrents/userGetsTorrentFiles'

export const torrentQueriesResolvers: RootResolverObject<
  unknown,
  Pick<GQLQuery, 'showTorrents' | 'showTorrentFiles'>
> = {
  showTorrents: async (_, __, { services }) => UserGetsTorrentLists(services),

  showTorrentFiles: async (
    _,
    { torrentId }: GQLQueryShowTorrentFilesArgs,
    { services }
  ) => UserGetsTorrentFiles(services, torrentId),
}
