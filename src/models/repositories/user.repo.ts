import { TUserAttrs } from "~/@types/model/user.type"
import { UserModel } from "../user.model"

export const checkEmailExists = async (email: string) => {
  return await UserModel.findOne({ email }).lean()
}

export const createUser = async (data: TUserAttrs) => await UserModel.build(data)
