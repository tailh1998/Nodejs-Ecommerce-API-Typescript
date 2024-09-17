import bcrypt from "bcrypt"
import { BadRequestError, InternalServerError, NotFoundError } from "~/core/error.response"
import { UserModel } from "~/models/user.model"
import { EmailService } from "./email.service"
import { OtpService } from "./otp.service"
import { checkEmailExists, createUser } from "~/models/repositories/user.repo"
import { generateTokens } from "~/utils/tokens"
import { v4 as uuidV4 } from "uuid"
import { RoleModel } from "~/models/role.model"
import { ROLE } from "~/constants/role"
import { KeyTokenService } from "./keyToken.service"
import { createDecodeUser } from "~/auth/auth.utils"
import { getInfoData } from "~/utils"

export class UserService {
  static newUser = async ({
    email = "",
    captcha: _ = ""
  }: {
    email?: string
    captcha?: string
  }) => {
    // z: 1. check email exists in dbs
    const user = await UserModel.findOne({ email }).lean()

    if (user) {
      throw new BadRequestError("Email already exists")
    }

    // z: 2. send token via email user
    const result = await EmailService.sendEmailToken(email)

    return result
  }

  static checkLoginEmailToken = async (token?: string) => {
    try {
      // z: 0. check token
      if (!token) throw new BadRequestError("::[ERROR]:: Invalid Token!")

      // z: 1. check otp is valid
      const { email, token: _token } = await OtpService.checkOtp(token)
      if (!email) throw new NotFoundError("Email not found")

      // z: 2. check email exists
      const existedUser = await checkEmailExists(email)
      if (existedUser) throw new BadRequestError("Email already exists")

      const roleUser = await RoleModel.findOne({ name: ROLE.USER })

      const passwordHash = await bcrypt.hash(email, 10)

      // z: 3. Create New User n send token to client
      const newUser = await createUser({
        name: email,
        userId: uuidV4(),
        slug: `${email}_slug_${process.env.APP_NAME || "default"}`,
        password: passwordHash,
        role: roleUser?._id,
        email
      })
      if (newUser) {
        const { privateKey, publicKey } = generateTokens()
        console.log({ privateKey, publicKey })
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id.toString(),
          publicKey,
          privateKey
        })

        if (!keyStore) throw new BadRequestError("::[ERROR]:: Public Key String Error!")
        const tokens = await createDecodeUser(
          {
            userId: newUser._id.toString(),
            email
          },
          publicKey,
          privateKey
        )
        console.log(`Created Token Success:::::`, tokens)

        return {
          user: getInfoData({
            fields: ["_id", "name", "email"],
            object: newUser
          }),
          tokens
        }
      } else {
        throw new BadRequestError(`Check login email token fail with ${email}`)
      }
    } catch (error) {
      throw new InternalServerError(`Check login email token fail with ${error}`)
    }
  }
}
