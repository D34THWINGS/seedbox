import path from 'path'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
// import csrf from 'csurf'
import { makeAuthRouter } from './routes/auth/authRouter'
import { makeServices, Services } from './services'
import { GRAPHQL_PATH, makeGraphQlServer } from './graphql/graphqlServer'
import { makeAuthenticationMiddleware } from './middlewares/authenticationMiddleware'
import { makeErrorMiddleware } from './middlewares/errorMiddleware'

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

  app.use(GRAPHQL_PATH, makeAuthenticationMiddleware(services))
  await makeGraphQlServer(services, app)

  app.use(express.static(publicPath))
  // app.use(csrfProtection, (req, res, next) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken())
  //   next()
  // })
  app.use(makeAuthRouter(services))

  app.use(makeErrorMiddleware(services))

  return new Promise<Services>((resolve) =>
    app.listen(services.config.PORT, () => resolve(services))
  )
}

createServer().then(
  ({ config, logger }) => {
    logger.info(`Server started on port ${config.PORT}`)
  },
  (err) => {
    console.error(err)
    process.exit(1)
  }
)
