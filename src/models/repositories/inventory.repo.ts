import { Types } from "mongoose"
import { TInventoryAttrs } from "~/@types/model/inventory.type"
import { InternalServerError } from "~/core/error.response"
import { InventoryModel } from "../inventory.model"

const insertInventory = async (attrs: TInventoryAttrs) => {
  const result = await InventoryModel.build(attrs)
  if (!result) throw new InternalServerError("Cannot insert to inventory!")

  return result
}

const reserveInventory = async (userId: string, productId: string, quantity: number) => {
  const query = { productId: new Types.ObjectId(productId), stock: { $gte: quantity } }
  const update = {
    $inc: { stock: -quantity },
    $push: { reservations: { userId, quantity, createdAt: new Date() } }
  }
  const result = await InventoryModel.findOneAndUpdate(query, update, { new: true }).lean()

  if (!result) throw new InternalServerError("Cannot reserve product!")

  return result
}

export { insertInventory, reserveInventory }
