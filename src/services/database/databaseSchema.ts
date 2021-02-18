import { ObjectId } from 'mongodb'

export type BaseDocument = {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export type User = BaseDocument & {
  name: string
  email: string
  password: string
  disabledAt: Date | null
}

export type MagnetSource = { magnet: string }
export type TorrentFileSource = { torrentFile: string }
export type TorrentSource = MagnetSource | TorrentFileSource

export type Torrent = BaseDocument & {
  createdBy: ObjectId
  source: TorrentSource
  infoHash: string
}

export type DatabaseSchema = {
  users: User
  torrents: Torrent
}

export type CollectionName = keyof DatabaseSchema

export type DocumentId = ObjectId
