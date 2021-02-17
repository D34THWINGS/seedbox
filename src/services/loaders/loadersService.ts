import DataLoader from 'dataloader'
import {
  BaseDocument,
  DatabaseService,
  DocumentId,
  Torrent,
  User,
} from '../databaseService'
import { findUsersByIds } from '../../repositories/userRepository'
import { findTorrentsByIds } from '../../repositories/torrentsRepository'

const order = <T extends BaseDocument, K extends keyof T>(
  results: T[],
  values: readonly T[K][],
  key: K = '_id' as K
) =>
  values.map(
    (value) => results.find((result) => `${result[key]}` === `${value}`) ?? null
  )

export const makeLoadersService = (database: DatabaseService) => {
  return {
    userLoader: new DataLoader<DocumentId, User | null>(async (userIds) =>
      order(await findUsersByIds(database, [...userIds]), userIds)
    ),
    torrentLoader: new DataLoader<DocumentId, Torrent | null>(
      async (torrentIds) =>
        order(await findTorrentsByIds(database, [...torrentIds]), torrentIds)
    ),
  }
}
