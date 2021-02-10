import { Awaited } from '../helpers/types'
import { makeConfig } from './config'
import { makeLoggerService } from './logger'
import { makeDatabaseService } from './databaseService'
import { makeTorrentService } from './torrentService'
import { makeAuthenticationService } from './authenticationService'

export const makeServices = async () => {
  const config = makeConfig()
  return {
    config,
    logger: makeLoggerService(),
    database: await makeDatabaseService(config),
    torrent: makeTorrentService(),
    authentication: makeAuthenticationService(),
  }
}

export type Services = Awaited<ReturnType<typeof makeServices>>
