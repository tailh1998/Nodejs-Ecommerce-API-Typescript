import { TInventoryAttrs } from "~/@types/model/inventory.type"
import { BadRequestError } from "~/core/error.response"
import { InventoryModel } from "~/models/inventory.model"
import { getProductDetails } from "~/models/repositories/product.repo"

export class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location = ""
  }: TInventoryAttrs) => {
    try {
      const product = await getProductDetails(productId as string)
      if (!product) throw new BadRequestError("Product does not exists!")
      const query = { productId, shopId },
        updateSet = {
          $inc: { stock },
          $set: { location }
        },
        options = { upsert: true, new: true }

      return await InventoryModel.findOneAndUpdate(query, updateSet, options)
    } catch (error) {
      return error
    }
  }
}
