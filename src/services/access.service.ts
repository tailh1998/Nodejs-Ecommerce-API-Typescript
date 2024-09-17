import bcrypt from "bcrypt"
import { StatusCodes } from "http-status-codes"

import shopModel from "~/models/shop.model"
import { findByEmail } from "./shop.service"
import { KeyTokenService } from "./keyToken.service"

import { getInfoData } from "~/utils"
import { generateTokens } from "~/utils/tokens"
import { ROLE } from "~/constants/role"
import { createDecodeUser } from "~/auth/auth.utils"
import { AuthFailureError, BadRequestError, ForbiddenError } from "~/core/error.response"
import { DecodeUser } from "~/@types/model/keyToken.type"
import { KeyStoreParam } from "~/@types/auth.type"

type SignUpParams = {
  name: string
  email: string
  password: string
}

class AccessService {
  static signUp = async ({ name, email, password }: SignUpParams) => {
    const userExists = await shopModel.findOne({ email }).lean()

    if (userExists) throw new BadRequestError("::[ERROR]::User already registered!")

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [ROLE.SHOP]
    })
    if (newShop) {
      const { privateKey, publicKey } = generateTokens()
      console.log({ privateKey, publicKey })
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) throw new BadRequestError("::[ERROR]:: Public Key String Error!")
      const tokens = await createDecodeUser(
        {
          userId: newShop._id,
          email
        },
        publicKey,
        privateKey
      )
      console.log(`Created Token Success:::::`, tokens)
      return {
        code: StatusCodes.CREATED,
        metadata: {
          user: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop
          }),
          tokens
        }
      }
    }
    return {
      code: StatusCodes.OK,
      metadata: null
    }
  }

  static login = async ({
    email,
    password,
    refreshToken: _ // ! skip for now , fix after
  }: {
    email: string
    password: string
    refreshToken?: string
  }) => {
    const foundUser = await findByEmail({ email })
    if (!foundUser) throw new BadRequestError("User not registered!")
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) throw new AuthFailureError("Error Password !!!")

    const { privateKey, publicKey } = generateTokens()
    const { _id: userId } = foundUser

    const tokens = await createDecodeUser({ userId, email }, publicKey, privateKey)
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
      userId
    })

    return {
      user: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundUser
      }),
      tokens
    }
  }

  static logout = async (keyStore?: KeyStoreParam) =>
    await KeyTokenService.removeKeyById(keyStore?._id)

  /**
   * z: check token used && create new token
   */
  static renewToken = async ({
    refreshToken,
    user,
    keyStore
  }: {
    refreshToken?: string
    user?: DecodeUser
    keyStore?: KeyStoreParam
  }) => {
    const { userId, email } = user ?? {}

    if (!userId || !email || !keyStore) {
      throw new ForbiddenError("Something went wrong !!!")
    }

    // TODO 1. Check refreshToken used ?
    if (refreshToken && keyStore.refreshTokensUsed?.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError("Something went wrong !!!")
    }

    // TODO 2. Check refreshToken isValid ?
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered !!!")
    }

    // TODO 3. Get shop
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError("Shop not registered !!!")

    // TODO 4. Create new token
    const tokens = await createDecodeUser(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    )

    // TODO 5. Update token & add old token to refreshTokensUsed
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    // TODO 6. Return new token for user
    return {
      user,
      tokens
    }
  }
}

export default AccessService
