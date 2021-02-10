import { connect, ObjectId } from 'mongodb'
import { Awaited } from '../helpers/types'
import { Config } from './config'

export type BaseDocument = {
  _id: ObjectId
  createdAt: Date
  updateAt: Date
}

export type User = BaseDocument & {
  name: string
  email: string
  password: string
  disabledAt: Date | null
}

export type DatabaseSchema = {
  users: User
}

export type CollectionName = keyof DatabaseSchema

export type DocumentId = ObjectId

export const makeDatabaseService = async (config: Config) => {
  const connection = await connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const database = await connection.db()

  await database
    .collection<User>('users')
    .createIndex('email', { unique: true })

  return {
    generateId: (value?: string) => new ObjectId(value),
    getCollection: <TName extends CollectionName>(name: TName) =>
      database.collection<DatabaseSchema[TName]>(name),
  }
}

export type DatabaseService = Awaited<ReturnType<typeof makeDatabaseService>>
