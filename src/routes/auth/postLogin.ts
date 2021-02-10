import Joi from 'joi'
import { notFound } from '@hapi/boom'
import { Services } from '../../services'
import { findUserByEmail } from '../../repositories/userRepository'
import { validate, wrapHandler } from '../../helpers/http'
import { comparePassword, signResponse } from '../../helpers/authentication'

type LoginBody = {
  email: string
  password: string
}

const bodySchema = Joi.object<LoginBody>({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).required(),
})

export const POST_LOGIN = '/api/auth/login'

export const postLogin = (services: Services) =>
  wrapHandler(services, async (req, res) => {
    const { email, password } = validate<LoginBody>(req.body, bodySchema)

    const user = await findUserByEmail(services, email)

    if (!user || !(await comparePassword(password, user.password))) {
      throw notFound('Invalid email or password')
    }

    signResponse(services, res, user._id.toString())
      .status(200)
      .json({ success: true })
  })
