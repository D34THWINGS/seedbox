import { Awaited } from '../helpers/types'
import { makeConfig } from './config'
import { makeLoggerService } from './logger'
import { makeDatabaseService } from './databaseService'
import { makeTorrentService } from './torrentService'
import { makeAuthenticationService } from './authenticationService'
import { makeLoadersService } from './loaders/loadersService'

export const makeServices = async () => {
  const config = makeConfig()
  const logger = makeLoggerService()
  const database = await makeDatabaseService(config)
  return {
    config,
    logger,
    database,
    loaders: makeLoadersService(database),
    torrents: makeTorrentService(logger),
    authentication: makeAuthenticationService(),
  }
}

export type Services = Awaited<ReturnType<typeof makeServices>>
