import Joi from 'joi'
import { badRequest } from '@hapi/boom'
import { Services } from '../../services'
import { validate, wrapHandler } from '../../helpers/http'
import { createUser } from '../../repositories/userRepository'
import { hashPassword } from '../../helpers/authentication'
import { isDuplicateKeyError } from '../../helpers/database'

type RegisterBody = {
  name: string
  email: string
  password: string
}

const bodySchema = Joi.object<RegisterBody>({
  name: Joi.string().max(255).alphanum().required(),
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).required(),
})

export const POST_REGISTER = '/api/auth/register'

export const postRegister = (services: Services) =>
  wrapHandler(services, async (req, res) => {
    const userData = validate<RegisterBody>(req.body, bodySchema)

    try {
      await createUser(services, {
        ...userData,
        password: await hashPassword(userData.password),
      })
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw badRequest('Email already in use')
      }
    }

    res.status(200).json({ success: true })
  })
