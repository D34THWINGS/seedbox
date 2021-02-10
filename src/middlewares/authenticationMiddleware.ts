import { RequestHandler } from 'express'
import { forbidden } from '@hapi/boom'
import { Services } from '../services'
import { verifyToken } from '../helpers/authentication'
import { findUserById } from '../repositories/userRepository'

export const makeAuthenticationMiddleware = (
  services: Services
): RequestHandler => async (req, res, next) => {
  const sessionCookie = req.cookies[services.config.COOKIE_NAME]
  if (!sessionCookie) {
    return next(forbidden())
  }

  const { userId } = await verifyToken(services, sessionCookie)
  const user = await findUserById(
    services,
    services.database.generateId(userId)
  )
  if (!user || user.disabledAt) {
    return next(forbidden())
  }

  services.authentication.injectSession(user)
  next()
}
