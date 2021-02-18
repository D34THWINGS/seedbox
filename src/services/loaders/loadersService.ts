import DataLoader from 'dataloader'
import {
  BaseDocument,
  DocumentId,
  Torrent,
  User,
} from '../database/databaseSchema'
import { findUsersByIds } from '../../repositories/userRepository'
import { findTorrentsByIds } from '../../repositories/torrentsRepository'
import { DatabaseService } from '../database/databaseService'

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

export type LoadersService = ReturnType<typeof makeLoadersService>
