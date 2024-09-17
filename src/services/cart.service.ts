import { Types } from "mongoose"
import { createCart, findCart, updateCart } from "~/models/repositories/cart.repo"
import { STATE } from "~/constants/cart"
import { TCartProduct } from "~/@types/model/cart.type"
import { BadRequestError, InternalServerError } from "~/core/error.response"
import { ProductService } from "./product.service"

export class CartService {
  static async createCart(userId: string, products: TCartProduct[] = []) {
    const total_count = products.reduce((total, product) => (total += product.quantity), 0)
    const result = await createCart({
      userId,
      state: STATE.ACTIVE,
      products: [...products],
      total_count
    })
    if (!result) throw new InternalServerError("Cannot create new cart!")

    return result.toObject()
  }

  static async addToCart({ userId, product }: { userId: string; product: TCartProduct }) {
    const { productId, shopId, quantity } = product
    if (quantity < 1) throw new BadRequestError("Quantity must be more than 0!")

    const foundProduct = await ProductService.getProductDetails(productId as string)
    if (!foundProduct) throw new BadRequestError("Product does not exist!")

    const cart = await findCart(userId)
    if (!cart) return await this.createCart(userId, [product])

    const cartHasProduct = await findCart(userId, {
      "products.productId": productId
    })

    const filter = {
      userId: new Types.ObjectId(userId),
      ...(cartHasProduct ? { "products.productId": productId } : {})
    }
    const update = {
      ...(cartHasProduct ? {} : { $push: { products: { productId, shopId, quantity } } }),
      $inc: {
        total_count: product.quantity,
        ...(cartHasProduct ? { "products.$.quantity": product.quantity } : {})
      }
    }

    const result = await updateCart(filter, update)
    if (!result) throw new InternalServerError("Add product to cart fail!")

    return result
  }

  static async updateCart({ userId, product }: { userId: string; product: TCartProduct }) {
    if (!product.quantity) return this.removeFromCart(userId, product)

    const updateQuantity = product.quantity - (product.old_quantity || 0)

    const result = await updateCart(
      {
        userId: new Types.ObjectId(userId),
        "products.productId": product.productId,
        state: STATE.ACTIVE
      },
      {
        $inc: {
          "products.$.quantity": updateQuantity,
          total_count: updateQuantity
        }
      }
    )
    if (!result) throw new InternalServerError("Update cart fail!")

    return result
  }

  static async removeFromCart(userId: string, product: TCartProduct) {
    const result = await updateCart(
      { userId: new Types.ObjectId(userId) },
      {
        $pull: { "products.productId": product.productId },
        $inc: product.quantity - (product.old_quantity || 0)
      }
    )
    if (!result) throw new InternalServerError("Remove product from cart fail!")

    return result
  }

  static async getCartDetails(userId: string) {
    const cart = await findCart(userId)
    if (!cart) return await this.createCart(userId)

    return cart
  }
}
