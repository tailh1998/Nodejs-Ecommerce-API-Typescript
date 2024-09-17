import { QuerySelector, Types } from "mongoose"
import { TProduct, TRawProduct } from "~/@types/model/product.type"
import { BadRequestError, InternalServerError, NotFoundError } from "~/core/error.response"
import { ProductModel } from "~/models/product.model"
import { formatAttributeName, getSkipNumber } from "~/utils"
import { PRODUCT_PREFIX } from "~/constants/product"

type TProductFilter = {
  shop?: TProduct["product_shop"]
  isDraft?: TProduct["product_isDraft"]
  isPublished?: TProduct["product_isPublished"]
  deletedAt?: TProduct["product_deletedAt"] | QuerySelector<TProduct["product_deletedAt"]> | null
  _id?: string | { $in: Array<any> }
}

type TProductOption = {
  limit?: string | number
  page?: string | number
  select?: Array<keyof TRawProduct>
}

const getAllProducts = async (
  { isPublished = true, ...filter }: TProductFilter,
  options?: TProductOption
) => {
  return await queryProduct(
    { ...filter, isDraft: !isPublished, deletedAt: null },
    {
      ...options,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_ratingsAverage",
        "product_slug"
      ]
    }
  )
}

const getAllDeletedProducts = async (filter: TProductFilter, options: TProductOption) => {
  return await queryProduct(
    { ...filter, deletedAt: { $ne: null } },
    {
      ...options,
      select: [
        "product_name",
        "product_thumb",
        "product_price",
        "product_ratingsAverage",
        "product_slug",
        "product_deletedAt"
      ]
    }
  )
}

const getProductDetails = async (productId: string, shopId?: string) => {
  if (!productId) throw new BadRequestError("Product ID is required!")

  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    ...(shopId ? { shop: new Types.ObjectId(shopId) } : {}),
    isPublished: true,
    isDraft: false
  })

  if (!result) throw new NotFoundError()

  return result
}

const getProductDetailsForShop = async (productId: string, shopId: string) => {
  const result = await findProduct({
    _id: new Types.ObjectId(productId),
    shop: new Types.ObjectId(shopId)
  })

  return result
}

const unpublishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({
    shop,
    _id: new Types.ObjectId(productId)
  })
  if (!foundProduct) throw new BadRequestError("Product does not exist!")

  const result = await foundProduct.updateOne({
    product_isDraft: true,
    product_isPublished: false
  })
  if (!result) throw new InternalServerError("Cannot unpublish product!")

  return result
}

const publishProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({
    shop,
    _id: new Types.ObjectId(productId)
  })
  if (!foundProduct) throw new BadRequestError("Product does not exist!")

  const result = await foundProduct.updateOne({
    product_isDraft: false,
    product_isPublished: true
  })
  if (!result) throw new InternalServerError("Cannot unpublish product!")

  return result
}

const searchProducts = async (search: string) => {
  const result = await ProductModel.find(
    {
      $text: { $search: search },
      product_isDeleted: null,
      product_isPublished: true
    },
    { score: { $meta: "textScore" } }
  )
    .select("name thumb slug price ratingsAverage")
    .lean()

  return result
}

const restoreProduct = async (shop: string, productId: string) => {
  const deletedProduct = await findProduct({ shop, _id: new Types.ObjectId(productId) }, true)
  if (!deletedProduct) throw new BadRequestError("Product does not exist!")

  const result = await deletedProduct.updateOne({ product_deletedAt: null })
  if (!result) throw new InternalServerError("Restore product fail!")

  return result
}

const deleteProduct = async (shop: string, productId: string) => {
  const foundProduct = await findProduct({ shop, _id: productId })
  if (!foundProduct) throw new BadRequestError("Product does not exist!")

  const result = await foundProduct
    .updateOne({
      product_deletedAt: Date.now(),
      product_isPublished: false,
      product_isDraft: true
    })
    .lean()
  if (!result) throw new InternalServerError("Delete product fail!")

  return result
}

const validateCheckoutProducts = async (
  shopId: string,
  products: {
    productId: string
    quantity: number
    price: number
  }[]
) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductDetails(product.productId, shopId)
      if (!foundProduct) {
        throw new BadRequestError("Product not found")
      }

      return {
        ...product,
        price: foundProduct.product_price!
      }
    })
  )
}

const queryProduct = async (
  filter: TProductFilter,
  { select, limit = 50, page = 1 }: TProductOption
) => {
  return await ProductModel.find<TProduct>(formatAttributeName(filter, PRODUCT_PREFIX))
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .select(select || {})
    .skip(getSkipNumber(+limit || 50, +page || 1))
    .limit(+limit || 50)
    .lean()
}

const findProduct = async (query: Object, isDeleted = false) => {
  return await ProductModel.findOne({
    ...formatAttributeName(query, PRODUCT_PREFIX),
    product_deletedAt: { [isDeleted ? "$ne" : "$eq"]: null }
  })
    .populate("product_shop", "name email -_id")
    .select("-__v -updatedAt -createdAt")
}

export {
  findProduct,
  deleteProduct,
  getAllProducts,
  restoreProduct,
  publishProduct,
  searchProducts,
  unpublishProduct,
  getProductDetails,
  getAllDeletedProducts,
  validateCheckoutProducts,
  getProductDetailsForShop
}
