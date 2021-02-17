import { Services } from '../../services'
import { serializeArray } from '../../helpers/serialization'
import { findAllTorrents } from '../../repositories/torrentsRepository'

export const UserGetsTorrentLists = async (services: Services) =>
  serializeArray(await findAllTorrents(services.database))
