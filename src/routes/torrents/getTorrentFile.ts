import path from 'path'
import Joi from 'joi'
import { notFound } from '@hapi/boom'
import { Services } from '../../services'
import { validate, wrapHandler } from '../../helpers/http'

type GetTorrentFileParams = {
  torrentId: string
  fileId: string
}

const paramsSchema = Joi.object<GetTorrentFileParams>({
  torrentId: Joi.string().required(),
  fileId: Joi.string().required(),
})

export const GET_TORRENT_FILE =
  '/api/torrents/:torrentId/files/:fileId/download'

export const makeGetTorrentFile = (services: Services) =>
  wrapHandler(services, async (req, res) => {
    const { torrentId, fileId } = validate<GetTorrentFileParams>(
      req.params,
      paramsSchema
    )

    const torrent = await services.loaders.torrentLoader.load(
      services.database.generateId(torrentId)
    )
    if (!torrent) {
      throw notFound('Torrent not found')
    }

    const filePath = services.torrents.getTorrentFilePath(
      torrent.infoHash,
      fileId
    )
    if (!filePath) {
      throw notFound('File not found')
    }

    res.sendFile(path.join(__dirname, '../../../downloads/', filePath))
  })
