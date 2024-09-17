import { Types } from "mongoose"
import keyTokenModel from "~/models/keyToken.model"
import { CreateKeyTokenParams } from "~/@types/model/keyToken.type"

export class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }: CreateKeyTokenParams) => {
    try {
      const filter = {
          user: userId
        },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken
        },
        options = {
          upsert: true,
          new: true
        }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.log(error)
    }
  }

  static findByUserId = async (userId: string) =>
    await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })

  static removeKeyById = async (_id?: Types.ObjectId) => await keyTokenModel.deleteOne({ _id })

  static deleteKeyByUserId = async (userId: Types.ObjectId | string) =>
    await keyTokenModel.deleteOne({ user: userId })

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken: string) => {
    return await keyTokenModel.findOne({ refreshToken })
  }
}
