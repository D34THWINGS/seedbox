import { BaseDocument } from '../services/database/databaseSchema'

export function serialize<T extends BaseDocument>(
  document: T
): Omit<T, '_id'> & { id: string }
export function serialize<T extends BaseDocument>(
  document: T | null
): (Omit<T, '_id'> & { id: string }) | null
export function serialize<T extends BaseDocument>(document: T | null) {
  if (!document) {
    return null
  }

  const { _id, ...documentWithoutId } = document
  return {
    ...documentWithoutId,
    id: _id.toString(),
  }
}

export const serializeArray = <T extends BaseDocument>(array: T[]) =>
  array.map((value) => serialize(value))
