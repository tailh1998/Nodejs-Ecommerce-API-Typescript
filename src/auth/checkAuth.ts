import { RequestHandler, Request } from "express"
import { asyncHandler } from "~/middleware/error.middleware"
import { HEADER } from "~/constants"
import { ConflictRequestError } from "~/core/error.response"
import { findKeyById } from "~/services/apiKey.service"
import { TApiKey } from "~/@types/model/apiKey.type"

interface ApiKeyRequest extends Request {
  objKey?: TApiKey
}

const checkApiKey: RequestHandler = async (req: ApiKeyRequest, _, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()
  if (!key) throw new ConflictRequestError()
  const objKey = await findKeyById(key)
  if (!objKey) throw new ConflictRequestError()
  req.objKey = objKey
  return next()
}

export const apiKey = asyncHandler(checkApiKey)

export const permission = (code: string): RequestHandler => {
  return (req: ApiKeyRequest, _, next) => {
    if (!req.objKey?.permissions) throw new ConflictRequestError("::[ERROR]::Permission Denied")
    const isValidPermission = req.objKey.permissions.includes(code)

    if (!isValidPermission) throw new ConflictRequestError("::[ERROR]::Permission Denied")
    return next()
  }
}
