import { RequestHandler } from 'express'
import { forbidden } from '@hapi/boom'
import { Services } from '../services'
import { signResponse, verifyToken } from '../helpers/authentication'

export const makeAuthenticationMiddleware = (
  services: Services
): RequestHandler => async (req, res, next) => {
  const sessionCookie = req.signedCookies[services.config.COOKIE_NAME]
  if (!sessionCookie) {
    return next(forbidden())
  }

  const { userId } = await verifyToken(services, sessionCookie)

  signResponse(services, res, userId)
  services.authentication.injectSession(services.database.generateId(userId))
  next()
}
