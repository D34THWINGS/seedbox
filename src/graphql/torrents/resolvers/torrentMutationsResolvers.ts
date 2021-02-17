import { FileUpload } from 'graphql-upload'
import { UserInputError } from 'apollo-server-express'
import {
  GQLMutationAddTorrentWithMagnetArgs,
  GQLMutationPauseResumeTorrentArgs,
  GQLMutationAddTorrentWithFileArgs,
  GQLResolvers,
} from '../../schemaTypes'
import { UserAddsTorrent } from '../../../contexts/torrents/userAddsTorrent'
import { getStreamToBase64 } from '../../../helpers/torrents'
import { UserPausesOrResumesTorrent } from '../../../contexts/torrents/userPausesOrResumesTorrent'

export const torrentMutationsResolvers: GQLResolvers['Mutation'] = {
  addTorrentWithMagnet: async (
    _,
    { link }: GQLMutationAddTorrentWithMagnetArgs,
    { services }
  ) => UserAddsTorrent(services, { magnet: link }),

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

    return UserAddsTorrent(services, { torrentFile: base64String })
  },

  pauseResumeTorrent: async (
    _,
    { torrentId, paused }: GQLMutationPauseResumeTorrentArgs,
    { services }
  ) => await UserPausesOrResumesTorrent(services, torrentId, paused),
}
