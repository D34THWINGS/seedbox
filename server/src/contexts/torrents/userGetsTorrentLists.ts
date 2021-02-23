import { Services } from '../../services'
import { findAllTorrents } from '../../repositories/torrentsRepository'

export const UserGetsTorrentLists = async (services: Services) =>
  findAllTorrents(services.database)
