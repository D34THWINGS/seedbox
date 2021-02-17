import fs from 'fs'
import path from 'path'
import Joi from 'joi'
import { badRequest } from '@hapi/boom'
import { Services } from '../../services'
import { validate, wrapHandler } from '../../helpers/http'
import { NotFoundError } from '../../helpers/errors'

type GetTorrentFileStreamParams = {
  torrentId: string
  fileId: string
}

const paramsSchema = Joi.object<GetTorrentFileStreamParams>({
  torrentId: Joi.string().required(),
  fileId: Joi.string().required(),
})

const CHUNK_SIZE = 1024 ** 2 * 5 // 1MB

export const GET_TORRENT_FILE_STREAM =
  '/api/torrents/:torrentId/files/:fileId/stream'

export const makeGetTorrentFileStream = (services: Services) =>
  wrapHandler(services, async (req, res) => {
    const { torrentId, fileId } = validate<GetTorrentFileStreamParams>(
      req.params,
      paramsSchema
    )

    const range = req.headers.range
    if (!range) {
      throw badRequest('Requires Range header')
    }

    const torrent = await services.loaders.torrentLoader.load(
      services.database.generateId(torrentId)
    )
    if (!torrent) {
      throw new NotFoundError('Torrent not found')
    }

    const relativeFilePath = services.torrents.getTorrentFilePath(
      torrent.infoHash,
      fileId
    )
    if (!relativeFilePath) {
      throw new NotFoundError('File not found')
    }

    const filePath = path.join(
      __dirname,
      '../../../downloads/',
      relativeFilePath
    )
    const { size: videoSize } = await fs.promises.stat(filePath)

    // Parse Range
    // Example: "bytes=32324-"
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    // Create headers
    const contentLength = end - start + 1
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    }

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers)

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(filePath, { start, end })

    // Stream the video chunk to the client
    videoStream.pipe(res)
  })
