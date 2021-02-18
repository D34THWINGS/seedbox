import { connect, ObjectId } from 'mongodb'
import { Awaited } from '../../helpers/types'
import { Config } from '../config'
import { CollectionName, DatabaseSchema, Torrent, User } from './databaseSchema'

export const makeDatabaseService = async (config: Config) => {
  const connection = await connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const database = await connection.db()

  await database
    .collection<User>('users')
    .createIndex('email', { unique: true })
  await database
    .collection<Torrent>('torrent')
    .createIndex('email', { unique: true })

  return {
    generateId: (value?: string) => new ObjectId(value),
    getCollection: <TName extends CollectionName>(name: TName) =>
      database.collection<DatabaseSchema[TName]>(name),
  }
}

export type DatabaseService = Awaited<ReturnType<typeof makeDatabaseService>>
