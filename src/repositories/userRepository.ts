import { DocumentId, User } from '../services/databaseService'
import { Services } from '../services'

const getUsersCollection = (services: Services) =>
  services.database.getCollection('users')

export const findUserByEmail = (services: Services, email: string) =>
  getUsersCollection(services).findOne({
    email,
  })

export const findUserById = (services: Services, id: DocumentId) =>
  getUsersCollection(services).findOne({
    _id: id,
  })

export const createUser = async (
  services: Services,
  userData: Pick<User, 'name' | 'email' | 'password'>
) => {
  const insertedUser = {
    ...userData,
    _id: services.database.generateId(),
    createdAt: new Date(),
    updateAt: new Date(),
    disabledAt: null,
  }
  await getUsersCollection(services).insertOne(insertedUser)
  return insertedUser
}
