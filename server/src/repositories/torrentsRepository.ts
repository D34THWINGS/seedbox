import { DocumentId, Torrent } from '../services/database/databaseSchema'
import { DatabaseService } from '../services/database/databaseService'

const getTorrentsCollection = (database: DatabaseService) =>
  database.getCollection('torrents')

export const findTorrentsByIds = async (
  database: DatabaseService,
  torrentIds: DocumentId[]
) =>
  getTorrentsCollection(database)
    .find({ _id: { $in: torrentIds } })
    .toArray()

export const createOrUpdateTorrent = async (
  database: DatabaseService,
  torrentData: Pick<Torrent, 'createdBy' | 'source' | 'infoHash'>
) => {
  const { value } = await getTorrentsCollection(database).findOneAndUpdate(
    { infoHash: torrentData.infoHash },
    {
      $setOnInsert: {
        ...torrentData,
        _id: database.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, returnOriginal: true }
  )
  return value as Torrent
}

export const findAllTorrents = async (database: DatabaseService) =>
  getTorrentsCollection(database).find().toArray()
