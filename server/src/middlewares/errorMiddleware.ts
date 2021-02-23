import { ErrorRequestHandler } from 'express'
import { sendError } from '../helpers/http'
import { Services } from '../services'

export const makeErrorMiddleware = (
  services: Services
): ErrorRequestHandler => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  sendError(services, res, err)
}
