import { ObjectId, HydratedDocument, Model } from "mongoose"

export type TRawUser = {
  _id: string | ObjectId
  userId: string | number
  password: string
  slug: string
  name: string
  email: string
  salf?: string
  phone?: string
  sex?: string
  avatar?: string
  dateOfBirth?: Date
  role?: string | ObjectId
  status?: "pending" | "active" | "block"
}

export type TUser = HydratedDocument<TRawUser>

export type TUserAttrs = Omit<TRawUser, "_id">

export type TUserModel = Model<TUser> & {
  build(attrs: TUserAttrs): Promise<TUser>
}
