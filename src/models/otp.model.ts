import { Schema, model } from "mongoose"
import { TOtp, TOtpAttrs, TOtpModel } from "~/@types/model/otp.model"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const otpSchema = new Schema<TOtp, TOtpModel>(
  {
    token: { type: String, required: true },
    email: { type: String, require: true },
    status: { type: String, default: "pending", enum: ["pending", "active", "block"] },
    expireAt: {
      type: Date,
      default: Date.now(),
      expires: 60
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.OTPS
  }
)

otpSchema.statics.build = async (attrs: TOtpAttrs): Promise<TOtp> => {
  return OtpModel.create(attrs)
}

export const OtpModel = model<TOtp, TOtpModel>(DOCUMENT_NAME.OTP, otpSchema)
