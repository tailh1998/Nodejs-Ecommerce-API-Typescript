import Joi from "joi"
import { RequestHandler } from "express"
import { isEmail, isPassWord, isString } from "~/utils/validator"
import { UnprocessableEntityError } from "~/core/error.response"

// z: FYI - if u want to custom/override error message follow links below:
// !: https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages
// !: https://github.com/hapijs/joi/blob/master/lib/types/string.js#L694

export const signUpValidation: RequestHandler = async (req, _, next) => {
  const schema = Joi.object({
    name: isString().min(3).max(50),
    email: isEmail(),
    password: isPassWord()
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new UnprocessableEntityError(`${error}`))
  }
}

export const loginValidation: RequestHandler = async (req, _, next) => {
  const schema = Joi.object({
    email: isEmail(),
    password: isPassWord(),
    refreshToken: isString(false)
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new UnprocessableEntityError(`${error}`))
  }
}
