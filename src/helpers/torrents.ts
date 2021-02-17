import { ReadStream } from 'fs'
import { createHash } from 'crypto'
import { TorrentFileSource, TorrentSource } from '../services/databaseService'

export const isTorrentFileSource = (
  source: TorrentSource
): source is TorrentFileSource => {
  return !!(source as TorrentFileSource).torrentFile
}

export const getTorrentLinkFromSource = (source: TorrentSource) => {
  if (!isTorrentFileSource(source)) {
    return source.magnet
  }

  return Buffer.from(source.torrentFile, 'base64')
}

export const getStreamToBase64 = (stream: ReadStream, limit: number) => {
  let buffer = Buffer.from('')
  stream.on('data', (chunk) => {
    if (buffer.length + chunk.length > limit) {
      stream.destroy(new Error('File size limit exceeded'))
      return
    }

    buffer = Buffer.concat([
      buffer,
      chunk instanceof Buffer ? chunk : Buffer.from(chunk),
    ])
  })

  return new Promise<string>((resolve, reject) => {
    stream.on('end', () => resolve(buffer.toString('base64')))
    stream.on('error', reject)
  })
}

export const getTorrentFileIdFromName = (fileName: string) =>
  createHash('sha256').update(fileName).digest('hex').slice(0, 15)
