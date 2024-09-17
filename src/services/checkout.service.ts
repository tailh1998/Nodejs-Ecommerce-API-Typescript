import { BadRequestError } from "~/core/error.response"
import { findCart } from "~/models/repositories/cart.repo"
import { validateCheckoutProducts } from "~/models/repositories/product.repo"
import { isNullish } from "~/utils"
import { DiscountService } from "./discount.service"
import { acquireLock, releaseLock } from "./redis.service"
import { OrderModel } from "~/models/order.model"

type TCheckoutProduct = {
  productId: string
  quantity: number
  price: number
}

type TCheckoutOrder = {
  shopId: string
  discountCode: string
  products: TCheckoutProduct[]
}

type TCreateOrder = {
  orders: TCheckoutOrder[]
  cartId: string
  userId: string
  address: Record<string, any>
  payment: Record<string, any>
}

export class CheckoutService {
  /**
    {
        userId,
        cartId,
        orders: [
            {
                shopId,
                discountCode: 'code',
                products: [
                    {
                        productId,
                        quantity,
                        price
                    }
                ]
            },{
                shopId,
                discountCode: 'code',
                products: [
                    {
                        productId,
                        quantity,
                        price
                    }
                ]
            }
        ]
    }
*/
  static checkoutReview = async ({
    userId,
    orders = []
  }: {
    userId: string
    orders: TCheckoutOrder[]
  }) => {
    const foundCart = await findCart(userId)

    if (!foundCart) throw new BadRequestError("Cart does not exists"!)

    const orderDetails = {
      totalPrice: 0,
      shipping: 0,
      totalDiscount: 0,
      final: 0
    }

    const finalOrders: TCheckoutOrder[] = []

    for (let i = 0; i < orders.length; i++) {
      const { shopId, discountCode, products } = orders[i]
      const checkedProducts = await validateCheckoutProducts(shopId, products)

      if (checkedProducts.some((prod) => isNullish(prod))) {
        throw new BadRequestError("Check out data is error!")
      }

      const totalPrice = products.reduce((total, prod) => total + prod!.price * prod!.quantity, 0)

      orderDetails.totalPrice += totalPrice

      if (discountCode) {
        const x = await DiscountService.useDiscount({
          code: discountCode,
          userId,
          orders: products
        })

        orderDetails.totalDiscount += x.discount
        orderDetails.final += x.final
      } else {
        orderDetails.final += totalPrice
      }

      finalOrders.push({ ...orders[i], products })
    }

    return { orderDetails, finalOrders }
  }

  static createOrder = async ({
    orders,
    cartId,
    userId,
    address = {},
    payment = {}
  }: TCreateOrder) => {
    const { orderDetails, finalOrders } = await this.checkoutReview({
      userId,
      orders
    })

    // Check if the order quantity exceeds the stock quantity.
    const acquireProduct = []
    const products = finalOrders.flatMap((order) => order.products)

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(userId, productId, quantity)
      acquireProduct.push(!!keyLock)

      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    // Check if any product is out of stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Some items have been updated. Please check again!")
    }

    const newOrder = await OrderModel.create({
      userId,
      checkout: orderDetails,
      shipping: address,
      payment: payment,
      products: finalOrders
    })

    if (newOrder) {
      // remove product in my cart [cartId]
      console.log("[cartId]::::", cartId)
    } else {
      // do sth
    }

    return newOrder
  }

  // z: [USER]
  static getOrdersByUser = async () => {}
  static getOneOrderByUser = async () => {}
  static cancelOrderByUser = async () => {}

  // z: [ADMIN]
  static updateOrderStatusByShop = async () => {}
}
