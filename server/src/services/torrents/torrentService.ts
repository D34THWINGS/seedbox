import path from 'path'
import WebTorrent, { Torrent } from 'webtorrent'
import FSChunkStore from 'fs-chunk-store'
import { getTorrentFileIdFromName } from '../../helpers/torrents'
import { throttle } from '../../helpers/functions'
import { Logger } from '../logger'
import { PubSubService } from '../pubSubService'
import { Config } from '../config'
import { TorrentFile, TorrentInfo } from './torrentTypes'

const getTorrentInfo = (torrent: Torrent): TorrentInfo => ({
  _id: torrent.infoHash,
  name: torrent.name,
  paused: torrent.paused,
  done: torrent.done,
  length: torrent.length,
  downloaded: torrent.downloaded,
  downloadSpeed: torrent.downloadSpeed,
  timeRemaining: torrent.timeRemaining,
  progress: torrent.progress,
})

export const makeTorrentService = (
  config: Config,
  logger: Logger,
  pubSubService: PubSubService
) => {
  const client = new WebTorrent()

  const throttledDownloadListener = throttle(async () => {
    const torrents = Array.from(torrentsToDispatch.values()).map(getTorrentInfo)
    try {
      await pubSubService.publishEvent('TORRENTS_PROGRESSED', {
        torrentsProgressed: torrents,
      })
    } catch (e) {
      logger.error(e)
    }
  }, parseInt(config.DOWNLOAD_SUBSCRIPTION_THROTTLE, 10))

  const torrentsToDispatch = new Map<string, Torrent>()
  const downloadListener = (torrent: Torrent) => {
    torrentsToDispatch.set(torrent.infoHash, torrent)
    throttledDownloadListener()
  }

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
      downloadListener(torrent)
    })

    torrent.on('done', () =>
      logger.debug(`Torrent "${torrent.name}" downloaded`)
    )
    torrent.on('warning', (message) => logger.warn(message))
    torrent.on('error', (error) => logger.error(error))
  })

  client.on('error', (error) => logger.error(error))

  const downloadsPath = path.resolve(config.DOWNLOAD_FOLDER)
  logger.debug(`Downloading files in: ${downloadsPath}`)

  return {
    getDownloadsPath() {
      return downloadsPath
    },
    addTorrent(link: string | Buffer) {
      const existingTorrent = client.get(link)
      if (existingTorrent) {
        return existingTorrent.infoHash
      }

      const torrent = client.add(link, {
        path: downloadsPath,
        store: FSChunkStore,
      })
      return torrent.infoHash
    },
    getTorrent(link: string | Buffer): TorrentInfo | null {
      const torrent = client.get(link)
      if (!torrent) {
        return null
      }
      return getTorrentInfo(torrent)
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
    listTorrentFiles(link: string | Buffer): TorrentFile[] {
      const torrent = client.get(link)
      if (!torrent) {
        return []
      }

      return torrent.files.map((file) => ({
        _id: getTorrentFileIdFromName(file.name),
        name: file.name,
        length: file.length,
        downloaded: file.downloaded,
        progress: file.progress,
      }))
    },
  }
}
