import { RequestHandler } from "express"

import { OK } from "~/core/success.response"
import { CartService } from "~/services/cart.service"
import { getReturnData } from "~/utils"

export class CartController {
  static addToCart: RequestHandler = async (req, res) => {
    const payload = {
      userId: req.user.userId,
      product: req.body.product
    }
    const result = await CartService.addToCart(payload)

    new OK({
      message: "Add product to cart successfully!",
      metadata: {
        data: getReturnData(result, { without: ["__v"] })
        //   link: {
        //     self: { href: '/api/v1/cart', method: 'POST' },
        //   }
      }
    }).send(res)
  }

  static getCartDetails: RequestHandler = async (req, res) => {
    const result = await CartService.getCartDetails(req.user.userId)
    new OK({
      message: "Get all products from cart successfully!",
      metadata: {
        data: getReturnData(result, { without: ["__v"] })
        //   link: {
        //     self: { href: "/api/v1/cart", method: "GET" }
        //   }
      }
    }).send(res)
  }

  static updateCart: RequestHandler = async (req, res) => {
    const payload = {
      userId: req.user.userId,
      product: req.body.product
    }
    const result = await CartService.updateCart(payload)

    new OK({
      message: "Add product to cart successfully!",
      metadata: {
        data: getReturnData(result, { without: ["__v"] })
        //   link: {
        //     self: { href: "/api/v1/cart/update", method: "POST" }
        //   }
      }
    }).send(res)
  }
}
