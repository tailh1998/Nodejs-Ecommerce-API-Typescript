import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { CartController } from "~/controllers/cart.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const cartRouter = Router()
const { getCartDetails, updateCart, addToCart } = CartController

cartRouter.use(authentication)

cartRouter.get("/", asyncHandler(getCartDetails))
cartRouter.post("/update", asyncHandler(updateCart))
cartRouter.post("/", asyncHandler(addToCart))

export default cartRouter
