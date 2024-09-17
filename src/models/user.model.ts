import { Schema, model } from "mongoose"
import { TUser, TUserAttrs, TUserModel } from "~/@types/model/user.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const userSchema = new Schema<TUser, TUserModel>(
  {
    userId: { type: String, required: true },
    slug: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    name: { type: String, default: "" },
    salf: { type: String, default: "" },
    phone: { type: String, default: "" },
    sex: { type: String, default: "" },
    avatar: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
    role: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME.ROLE },
    status: { type: String, default: "pending", enum: ["pending", "active", "block"] }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.USERS
  }
)

userSchema.statics.build = async (attrs: TUserAttrs): Promise<TUser> => {
  return UserModel.create(attrs)
}

export const UserModel = model<TUser, TUserModel>(DOCUMENT_NAME.USER, userSchema)
