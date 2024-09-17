import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { DiscountController } from "~/controllers/discount.controller"
import { asyncHandler } from "~/middleware/error.middleware"
import {
  validateDateCreateDiscount,
  validateDateUseDiscount
} from "~/validations/discount.validation"

const discountRouter = Router()
const {
  getApplicableProducts,
  getAllDiscountCodes,
  deleteDiscount,
  cancelDiscount,
  createDiscount,
  useDiscount
} = DiscountController

// api/v1/discounts/:code/products
discountRouter.get("/:code/products", asyncHandler(getApplicableProducts))
// api/v1/discounts?shopId=&limit=50&page=1
discountRouter.get("/", asyncHandler(getAllDiscountCodes))

discountRouter.use(authentication)

discountRouter.delete("/:code", asyncHandler(deleteDiscount))
discountRouter.patch("/cancel/:code", asyncHandler(cancelDiscount))
discountRouter.post("/", validateDateCreateDiscount, asyncHandler(createDiscount))
discountRouter.post("/:code", validateDateUseDiscount, asyncHandler(useDiscount))

export default discountRouter
