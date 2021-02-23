import { Response } from 'express'
import { addDays } from 'date-fns'
import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { Services } from '../services'

export type TokenPayload = { userId: string }

export const generateToken = (services: Services, userId: string) =>
  sign({ userId }, services.config.JWT_SECRET, {
    expiresIn: `${services.config.COOKIE_DAYS_TTL}d`,
  })

export const verifyToken = (services: Services, token: string) =>
  new Promise<TokenPayload>((resolve, reject) =>
    verify(token, services.config.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        reject(err)
      } else {
        resolve(decoded as TokenPayload)
      }
    })
  )

export const verifyTokenSync = (services: Services, token: string) =>
  verify(token, services.config.JWT_SECRET) as TokenPayload

export const signResponse = (
  services: Services,
  response: Response,
  userId: string
) => {
  const token = generateToken(services, userId)
  const ttl = parseInt(services.config.COOKIE_DAYS_TTL, 10)
  return response.cookie(services.config.COOKIE_NAME, token, {
    expires: addDays(new Date(), ttl),
    signed: true,
    httpOnly: true,
    sameSite: 'strict',
    secure: services.config.USE_SECURE_COOKIES === 'true',
  })
}

export const hashPassword = (password: string) => hash(password, 10)

export const comparePassword = (
  clearPassword: string,
  hashedPassword: string
) => compare(clearPassword, hashedPassword)
