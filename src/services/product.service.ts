import { ObjectId } from "mongoose"
import { ProductFactory } from "../factories/product"
import { TProductAttrs } from "~/@types/model/product.type"
import { getReturnData, removeNestedNullish } from "~/utils"
import {
  deleteProduct,
  findProduct,
  getAllDeletedProducts,
  getAllProducts,
  getProductDetails,
  getProductDetailsForShop,
  publishProduct,
  restoreProduct,
  searchProducts,
  unpublishProduct
} from "~/models/repositories/product.repo"
import { BadRequestError, InternalServerError } from "~/core/error.response"
import { insertInventory } from "~/models/repositories/inventory.repo"
import { NotificationService } from "./notification.service"
import { NOTIFICATION_TYPE } from "~/constants/notification"

type TProductQuery = {
  shop?: string | ObjectId
  limit?: string | number
  page?: string | number
}

type TPatchProduct = {
  shop: string
  productId?: string
}

type TUpdateProduct = TPatchProduct & {
  payload: TProductAttrs
}

export class ProductService {
  static createProduct = async (product: TProductAttrs) => {
    const Strategy = ProductFactory.createStrategy(product.type)

    const newProduct = await Strategy.createProduct(product)

    if (!newProduct) throw new InternalServerError()

    NotificationService.pushNotification({
      noti_type: NOTIFICATION_TYPE.PRODUCT.NEW,
      noti_senderId: product.shop,
      noti_receiverId: 0,
      noti_options: {
        product_name: newProduct.product_name,
        shop_name: newProduct.product_shop
      }
    })

    await insertInventory({
      productId: newProduct._id,
      shopId: newProduct.product_shop,
      location: "unknown",
      stock: newProduct.product_quantity
    })

    return getReturnData(newProduct, {
      without: ["__v", "createdAt", "updatedAt"]
    })
  }

  static updateProduct = async ({ shop, productId, payload }: TUpdateProduct) => {
    if (!productId) throw new BadRequestError()

    const foundProduct = await findProduct({ shop, _id: productId })
    if (!foundProduct) throw new BadRequestError("Product does not exist!")

    const ProductStrategy = ProductFactory.createStrategy(foundProduct.product_type)

    const update = await ProductStrategy.updateProduct(
      shop,
      productId,
      removeNestedNullish(payload)
    )
    if (!update) throw new InternalServerError()

    return getReturnData(update, {
      without: ["__v"]
    })
  }

  static deleteProduct = async ({ shop, productId }: TPatchProduct) => {
    if (!productId) throw new BadRequestError()

    return deleteProduct(shop, productId)
  }

  static restoreProduct = async ({ shop, productId }: TPatchProduct) => {
    if (!productId) throw new BadRequestError()

    return restoreProduct(shop, productId)
  }

  static searchProducts = async (search: string) => {
    return await searchProducts(search)
  }

  static getAllProducts = async ({ limit, page }: TProductQuery) => {
    return await getAllProducts({}, { limit, page })
  }

  static getAllDraftProducts = async ({ shop, limit, page }: TProductQuery) => {
    return await getAllProducts({ shop, isPublished: false }, { limit, page })
  }

  static async getAllDeletedProducts({ shop, limit, page }: TProductQuery) {
    return await getAllDeletedProducts({ shop }, { limit, page })
  }

  static async getProductDetailsForShop({ shop, productId }: TPatchProduct) {
    if (!productId) throw new BadRequestError()

    return getProductDetailsForShop(productId, shop)
  }

  static getAllPublished = async ({ shop, limit, page }: TProductQuery) => {
    return await getAllProducts({ shop }, { limit, page })
  }

  static unpublishProduct = async ({ shop, productId }: TPatchProduct) => {
    if (!productId) throw new BadRequestError()

    return await unpublishProduct(shop, productId)
  }

  static publishProduct = async ({ shop, productId }: TPatchProduct) => {
    if (!productId) throw new BadRequestError()

    NotificationService.pushNotification({
      noti_type: NOTIFICATION_TYPE.PRODUCT.NEW,
      noti_senderId: shop,
      noti_receiverId: 0,
      noti_options: {
        productId,
        shop
      }
    })

    return await publishProduct(shop, productId)
  }

  static async getProductDetails(productId: string) {
    return await getProductDetails(productId)
  }

  static destroyProduct = async ({ shop, productId }: TPatchProduct) => {
    if (!productId) throw new BadRequestError()

    const foundProduct = await findProduct({ shop, _id: productId }, true)
    if (!foundProduct) throw new BadRequestError("Product does not exist!")

    const Strategy = ProductFactory.createStrategy(foundProduct.product_type)

    const result = await Strategy.destroyProduct(shop, productId)

    return getReturnData(result, {
      without: ["__v", "createdAt", "updatedAt"]
    })
  }
}

// init factories
import "../factories/product"
