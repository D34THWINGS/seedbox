import { FileUpload } from 'graphql-upload'
import { UserInputError } from 'apollo-server-express'
import { RootResolverObject } from '../../graphqlTypes'
import {
  GQLMutationAddTorrentWithMagnetArgs,
  GQLMutation,
  GQLMutationPauseResumeTorrentArgs,
  GQLMutationAddTorrentWithFileArgs,
} from '../../schemaTypes'
import { UserAddsTorrent } from '../../../contexts/torrents/userAddsTorrent'
import { serialize } from '../../../helpers/serialization'
import { getStreamToBase64 } from '../../../helpers/torrents'
import { UserPausesOrResumesTorrent } from '../../../contexts/torrents/userPausesOrResumesTorrent'

export const torrentMutationsResolvers: RootResolverObject<
  unknown,
  Pick<
    GQLMutation,
    'addTorrentWithMagnet' | 'addTorrentWithFile' | 'pauseResumeTorrent'
  >
> = {
  addTorrentWithMagnet: async (
    _,
    { link }: GQLMutationAddTorrentWithMagnetArgs,
    { services }
  ) => {
    return serialize(await UserAddsTorrent(services, { magnet: link }))
  },

  addTorrentWithFile: async (
    _,
    { file }: GQLMutationAddTorrentWithFileArgs,
    { services }
  ) => {
    const upload = file as FileUpload

    let base64String
    try {
      base64String = await getStreamToBase64(
        upload.createReadStream(),
        parseInt(services.config.UPLOAD_LIMIT, 10)
      )
    } catch (e) {
      throw new UserInputError('Torrent file size too heavy')
    }

    return serialize(
      await UserAddsTorrent(services, { torrentFile: base64String })
    )
  },

  pauseResumeTorrent: async (
    _,
    { torrentId, paused }: GQLMutationPauseResumeTorrentArgs,
    { services }
  ) => serialize(await UserPausesOrResumesTorrent(services, torrentId, paused)),
}
