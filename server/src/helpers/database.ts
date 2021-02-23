import { MongoError } from 'mongodb'

export const isDuplicateKeyError = (error: Error) =>
  error instanceof MongoError && error.code === 11000
