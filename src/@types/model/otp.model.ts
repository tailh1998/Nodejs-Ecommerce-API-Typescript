import { ObjectId, HydratedDocument, Model } from "mongoose"

export type TRawOtp = {
  _id: string | ObjectId
  token: string | number
  email: string
  status?: "pending" | "active" | "block"
  expireAt: Date
}

export type TOtp = HydratedDocument<TRawOtp>

export type TOtpAttrs = Omit<TRawOtp, "_id" | "expireAt">

export type TOtpModel = Model<TOtp> & {
  build(attrs: TOtpAttrs): Promise<TOtp>
}
