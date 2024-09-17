import Joi from "joi"

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = "Your string fails to match the Object Id pattern!"

export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PASSWORD_RULE_MESSAGE =
  "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"

export const isEmail = () => Joi.string().email({ tlds: { allow: false } })

export const isString = (isRequired = true) =>
  isRequired ? Joi.string().required().trim().strict() : Joi.string().trim().strict()

export const isObjId = (isRequired = true) =>
  isString(isRequired).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)

export const isArrayObjectId = (isRequired = true) =>
  Joi.array().items(isObjId(isRequired)).default([])

export const isPassWord = () => isString().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
