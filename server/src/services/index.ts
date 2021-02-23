import { Awaited } from '../helpers/types'
import { makeConfig } from './config'
import { makeLoggerService } from './logger'
import { makeDatabaseService } from './database/databaseService'
import { makeTorrentService } from './torrents/torrentService'
import { makeAuthenticationService } from './authenticationService'
import { makeLoadersService } from './loaders/loadersService'
import { makePubSubService } from './pubSubService'

export const makeServices = async () => {
  const config = makeConfig()
  const logger = makeLoggerService()
  const pubSub = makePubSubService()
  const database = await makeDatabaseService(config)
  const loaders = makeLoadersService(database)
  return {
    config,
    logger,
    database,
    loaders,
    torrents: makeTorrentService(config, logger, pubSub),
    authentication: makeAuthenticationService(loaders),
    pubSub,
  }
}

export type Services = Awaited<ReturnType<typeof makeServices>>
