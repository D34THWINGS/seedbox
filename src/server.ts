import path from 'path'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
// import csrf from 'csurf'
import { makeAuthRouter } from './routes/auth/authRouter'
import { makeServices } from './services'
import { GRAPHQL_PATH, makeGraphQlServer } from './graphql/graphqlServer'
import { makeAuthenticationMiddleware } from './middlewares/authenticationMiddleware'
import { makeErrorMiddleware } from './middlewares/errorMiddleware'
import { bootstrapServer } from './bootstrap'
import {
  GET_TORRENT_FILE,
  makeGetTorrentFile,
} from './routes/torrents/getTorrentFile'
import {
  GET_TORRENT_FILE_STREAM,
  makeGetTorrentFileStream,
} from './routes/torrents/getTorrentFileStream'

const createServer = async () => {
  const services = await makeServices()

  const app = express()
  const publicPath = path.join(process.cwd(), 'public')
  // const csrfProtection = csrf({
  //   cookie: {
  //     key: '_csrf',
  //     httpOnly: true,
  //     sameSite: 'strict',
  //     secure: process.env.NODE_ENV === 'production',
  //   },
  // })

  app.use(json({ strict: true }))
  app.use(urlencoded({ extended: true }))
  app.use(cookieParser(services.config.COOKIE_SECRET))
  app.use(
    morgan('dev', {
      stream: { write: (str) => services.logger.http(str.replace('\n', '')) },
    })
  )

  app.use(GRAPHQL_PATH, makeAuthenticationMiddleware(services))
  await makeGraphQlServer(services, app)

  app.use(express.static(publicPath))
  // app.use(csrfProtection, (req, res, next) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken())
  //   next()
  // })
  app.use(makeAuthRouter(services))
  app.get(GET_TORRENT_FILE, makeGetTorrentFile(services))
  app.get(GET_TORRENT_FILE_STREAM, makeGetTorrentFileStream(services))

  app.use(makeErrorMiddleware(services))

  return { server: app, services }
}

createServer()
  .then(async ({ server, services }) => {
    await bootstrapServer(services)

    await new Promise<void>((resolve) =>
      server.listen(services.config.PORT, resolve)
    )

    services.logger.info(`Server started on port ${services.config.PORT}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
