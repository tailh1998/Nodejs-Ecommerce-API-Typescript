import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { CheckoutController } from "~/controllers/checkout.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const checkoutRouter = Router()

checkoutRouter.use(authentication)

checkoutRouter.post("/review", asyncHandler(CheckoutController.reviewCheckout))
checkoutRouter.post("/", asyncHandler(CheckoutController.createOrder))

export default checkoutRouter
