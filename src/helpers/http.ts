import { attempt, Schema, ValidationError } from 'joi'
import { badRequest, boomify, internal, isBoom } from '@hapi/boom'
import { RequestHandler, Response } from 'express'
import { Services } from '../services'

export const validate = <TResult = unknown>(
  body: unknown,
  schema: Schema<TResult>
): TResult => {
  try {
    return attempt(body, schema)
  } catch (err) {
    if (err instanceof ValidationError) {
      throw badRequest(err.message)
    } else {
      throw internal(err.message)
    }
  }
}

export const sendError = (services: Services, res: Response, error: Error) => {
  const wrappedError = isBoom(error) ? error : boomify(error)

  if (wrappedError.isServer) {
    services.logger.error(wrappedError.message)
  }

  const { headers, statusCode, payload } = wrappedError.output
  return Object.entries(headers)
    .reduce(
      (intermediateRes, [key, value]) => intermediateRes.header(key, value),
      res
    )
    .status(statusCode)
    .json(payload)
}

export const wrapHandler = (
  services: Services,
  handler: RequestHandler
): RequestHandler => async (req, res, next) => {
  try {
    await handler(req, res, next)
  } catch (error) {
    sendError(services, res, error)
  }
}
