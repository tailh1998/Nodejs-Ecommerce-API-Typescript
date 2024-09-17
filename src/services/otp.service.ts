import { NotFoundError } from "~/core/error.response"
import { OtpModel } from "~/models/otp.model"
import { generateRandomToken } from "~/utils/tokens"

export class OtpService {
  static newOtp = async (email: string) => {
    const token = generateRandomToken()

    return await OtpModel.build({ token, email })
  }

  static checkOtp = async (token: string) => {
    const validOtp = await OtpModel.findOne({ token })
    if (!validOtp) {
      throw new NotFoundError("Otp not found")
    }

    OtpModel.deleteOne({ token })

    return validOtp
  }
}
