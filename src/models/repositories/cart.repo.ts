import { Types } from "mongoose"
import { TCartAttrs } from "~/@types/model/cart.type"
import { CartModel } from "../cart.model"

const createCart = async (attrs: TCartAttrs) => {
  return await CartModel.build(attrs)
}

const updateCart = async (filter: Object, update: Object, options?: Object) => {
  return await CartModel.findOneAndUpdate(filter, update, { new: true, ...options }).lean()
}

const findCart = async (userId: string, filter?: Object) => {
  return await CartModel.findOne(
    { userId: new Types.ObjectId(userId), ...filter },
    { __v: 0 }
  ).lean()
}

export { findCart, createCart, updateCart }
