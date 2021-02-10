import { BaseDocument } from '../services/databaseService'

export const serialize = <T extends BaseDocument>(document: T) => ({
  ...document,
  _id: document._id.toString(),
})
