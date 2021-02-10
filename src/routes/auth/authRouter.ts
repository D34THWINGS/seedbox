import { Router } from 'express'
import { Services } from '../../services'
import { POST_LOGIN, postLogin } from './postLogin'
import { POST_REGISTER, postRegister } from './postRegister'

export const makeAuthRouter = (services: Services) => {
  const authRouter = Router()

  authRouter.post(POST_LOGIN, postLogin(services))
  authRouter.post(POST_REGISTER, postRegister(services))

  return authRouter
}
