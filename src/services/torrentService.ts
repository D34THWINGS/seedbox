import path from 'path'
import { EventEmitter } from 'events'
import WebTorrent from 'webtorrent'
import FSChunkStore from 'fs-chunk-store'
import { getTorrentFileIdFromName } from '../helpers/torrents'
import { Logger } from './logger'

export const makeTorrentService = (logger: Logger) => {
  const client = new WebTorrent()
  const emitter = new EventEmitter()

  client.on('torrent', (torrent) => {
    logger.debug(`Torrent "${torrent.name}" added`)

    torrent.on('download', (bytes) => {
      logger.debug(
        `+${bytes} bytes - ${torrent.downloaded}/${
          torrent.length
        } (${Math.round(torrent.progress * 100)}%) - ${Math.round(
          torrent.downloadSpeed / 1024 / 1024
        )} mb/s (${Math.round(torrent.timeRemaining / 1000)} s left)`
      )
      emitter.emit('download')
    })

    torrent.on('done', () =>
      logger.debug(`Torrent "${torrent.name}" downloaded`)
    )
    torrent.on('warning', (message) => logger.warn(message))
    torrent.on('error', (error) => logger.error(error))
  })

  client.on('error', (error) => logger.error(error))

  return {
    listenToDownloadEvents(callback: () => void) {
      emitter.on('download', callback)
    },
    addTorrent(link: string | Buffer) {
      const existingTorrent = client.get(link)
      if (existingTorrent) {
        return existingTorrent.infoHash
      }

      const torrent = client.add(link, {
        path: path.join(__dirname, '../../downloads'),
        store: FSChunkStore,
      })
      return torrent.infoHash
    },
    getTorrent(link: string | Buffer) {
      const torrent = client.get(link)
      if (!torrent) {
        return null
      }
      return {
        id: torrent.infoHash,
        name: torrent.name,
        paused: torrent.paused,
        done: torrent.done,
        length: torrent.length,
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        timeRemaining: torrent.timeRemaining,
        progress: torrent.progress,
      }
    },
    getTorrentFilePath(link: string | Buffer, fileId: string) {
      const torrent = client.get(link)
      if (!torrent) {
        return null
      }
      return (
        torrent.files.find(
          (file) => getTorrentFileIdFromName(file.name) === fileId
        )?.path ?? null
      )
    },
    pauseOrResumeTorrent(link: string | Buffer, paused: boolean) {
      const torrent = client.get(link)
      if (!torrent) {
        return
      }
      if (paused) {
        torrent.pause()
        return
      }
      torrent.resume()
    },
    listTorrentFiles(link: string | Buffer) {
      const torrent = client.get(link)
      if (!torrent) {
        return []
      }

      return torrent.files.map((file) => ({
        id: getTorrentFileIdFromName(file.name),
        name: file.name,
        length: file.length,
        downloaded: file.downloaded,
        progress: file.progress,
      }))
    },
  }
}
