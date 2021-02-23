export type TorrentInfo = {
  _id: string
  name: string
  paused: boolean
  done: boolean
  length: number
  downloaded: number
  downloadSpeed: number
  timeRemaining: number
  progress: number
}

export type TorrentFile = {
  _id: string
  name: string
  length: number
  downloaded: number
  progress: number
}
