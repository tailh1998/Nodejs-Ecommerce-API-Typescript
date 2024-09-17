import JWT from "jsonwebtoken"
import { RequestHandler } from "express"

import { KeyTokenService } from "~/services/keyToken.service"

import { HEADER } from "~/constants"
import { logger } from "~/utils/logger"
import { asyncHandler } from "~/middleware/error.middleware"
import { AuthFailureError, NotFoundError } from "~/core/error.response"
import { DecodeUser } from "~/@types/model/keyToken.type"

export const createDecodeUser = async (
  payload: DecodeUser,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days"
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days"
    })

    JWT.verify(accessToken, publicKey, (err: unknown, decode: unknown) => {
      err ? logger.error(`Verify Error::::::::${err}`) : console.log(`decode verify::::`, decode)
    })

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    throw error
  }
}

const checkAuth: RequestHandler = async (req, res, next) => {
  /**
   * z: Step
   * * 1.Check userId miss ??
   * * 2. get accessToken
   * * 3. verifyToken
   * * 4. check user in dbs
   * * 5. check keyStore with this userId
   * * 6. return next() if OK all
   */
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new AuthFailureError("::[ERROR]::Invalid Request")

  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError("::[ERROR]::Not Found KeyStore")

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey) as DecodeUser
      console.log("\n")
      console.log(":::::::::::::::::::::::::::::::::::")
      console.log("decodeUser", decodeUser)
      console.log(":::::::::::::::::::::::::::::::::::")
      console.log("\n")
      if (userId !== String(decodeUser.userId))
        throw new AuthFailureError("::[ERROR]::Invalid User")

      req.refreshToken = refreshToken
      req.user = decodeUser
      req.keyStore = keyStore

      return next()
    } catch (error) {
      throw new AuthFailureError("::[ERROR]::Invalid User")
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string
  if (!accessToken) throw new AuthFailureError("::[ERROR]::Invalid Request")

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as DecodeUser
    if (userId !== String(decodeUser.userId)) throw new AuthFailureError("::[ERROR]::Invalid User")
    console.log("\n")
    console.log(":::::::::::::::::::::::::::::::::::")
    console.log("decodeUser", decodeUser)
    console.log(":::::::::::::::::::::::::::::::::::")
    console.log("\n")

    req.keyStore = keyStore
    req.user = decodeUser

    return next()
  } catch (error) {
    throw new AuthFailureError("::[ERROR]::Invalid User")
  }
}

export const authentication = asyncHandler(checkAuth)

export const verifyJWT = async (token: string, keySecret: string) => JWT.verify(token, keySecret)
