import { TProductAttrs } from "~/@types/model/product.type"
import { ClothingModel } from "~/models/product.model"
import { PRODUCT_PREFIX } from "~/constants/product"
import { formatAttributeName } from "~/utils"
import { InternalServerError } from "~/core/error.response"
import { ProductFactoryAbstract } from "~/factories/product"
import { ProductStrategy } from "./Product.factory"

class ClothingStrategy extends ProductStrategy {
  static async createProduct(product: TProductAttrs) {
    const newClothing = await ClothingModel.create({
      ...formatAttributeName(product.attributes, PRODUCT_PREFIX),
      product_shop: product.shop
    })
    if (!newClothing) throw new InternalServerError("Server error::: Cannot create new product!")

    product._id = newClothing._id
    return await super.createProduct(product)
  }

  static async updateProduct(shop: string, productId: string, payload: TProductAttrs) {
    if (payload.attributes)
      await ClothingModel.findOneAndUpdate(
        { _id: productId },
        formatAttributeName(payload.attributes, PRODUCT_PREFIX),
        {
          new: true
        }
      ).lean()

    return await super.updateProduct(shop, productId, payload)
  }

  static async destroyProduct(shop: string, productId: string) {
    const result = await ClothingModel.deleteOne({
      shop,
      _id: productId
    }).lean()
    if (!result) throw new InternalServerError("Server error:::: Cannot delete the product!")

    const deleteResult = await super.destroyProduct(shop, productId)
    if (!deleteResult) throw new InternalServerError("Server error:::: Cannot delete the product!")

    return deleteResult
  }
}

export class ClothingFactory extends ProductFactoryAbstract {
  createStrategy() {
    return ClothingStrategy
  }
}
