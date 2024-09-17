import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { CheckoutService } from "~/services/checkout.service"

export class CheckoutController {
  static reviewCheckout: RequestHandler = async (req, res) => {
    const payload = {
      userId: req.user.userId,
      orders: req.body
    }

    const data = await CheckoutService.checkoutReview(payload)

    new OK({
      message: "Review checkout successfully!",
      metadata: {
        data
        // link: {
        //   self: { href: '/api/v1/checkout/review', method: 'POST' },
        // },
      }
    }).send(res)
  }

  static createOrder: RequestHandler = async (req, res) => {
    const data = await CheckoutService.createOrder(req.body)

    new OK({
      message: "Create Order successfully!",
      metadata: { data }
    }).send(res)
  }
}
