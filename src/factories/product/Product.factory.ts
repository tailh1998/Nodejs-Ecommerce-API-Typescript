import { ProductModel } from "../../models/product.model"
import { InternalServerError } from "~/core/error.response"
import { TProduct, TProductAttrs } from "~/@types/model/product.type"
import { PRODUCT_PREFIX } from "~/constants/product"
import { flattenObj, formatAttributeName } from "~/utils"

export class ProductStrategy {
  static createProduct = async (product: TProductAttrs): Promise<TProduct> => {
    const newProduct = await ProductModel.build(formatAttributeName(product, PRODUCT_PREFIX))
    if (!newProduct) throw new InternalServerError("Server error:::: Cannot create new product!")

    return newProduct
  }

  static updateProduct = async (shop: string, productId: string, payload: TProductAttrs) => {
    const { type, shop: shopId, ...update } = payload
    // delete (payload as Partial<IProductAttrs>).type

    return await ProductModel.findOneAndUpdate(
      { product_shop: shop, _id: productId },
      flattenObj(formatAttributeName(update, PRODUCT_PREFIX)),
      {
        new: true
      }
    ).lean()
  }

  static destroyProduct = async (shop: string, productId: string) => {
    return await ProductModel.deleteOne({ product_shop: shop, _id: productId }).lean()
  }
}
