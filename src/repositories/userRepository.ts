import { DocumentId, User } from '../services/database/databaseSchema'
import { DatabaseService } from '../services/database/databaseService'

const getUsersCollection = (database: DatabaseService) =>
  database.getCollection('users')

export const findUserByEmail = (database: DatabaseService, email: string) =>
  getUsersCollection(database).findOne({
    email,
  })

export const findUserById = (database: DatabaseService, id: DocumentId) =>
  getUsersCollection(database).findOne({
    _id: id,
  })

export const findUsersByIds = (
  database: DatabaseService,
  userIds: DocumentId[]
) =>
  getUsersCollection(database)
    .find({
      _id: { $in: userIds },
    })
    .toArray()

export const createUser = async (
  database: DatabaseService,
  userData: Pick<User, 'name' | 'email' | 'password'>
) => {
  const insertedUser: User = {
    ...userData,
    _id: database.generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    disabledAt: null,
  }
  await getUsersCollection(database).insertOne(insertedUser)
  return insertedUser
}
