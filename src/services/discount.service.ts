import { TDiscountAttrs } from "~/@types/model/discount.type"
import {
  BadRequestError,
  GoneError,
  InternalServerError,
  NotFoundError
} from "~/core/error.response"
import { DiscountModel } from "~/models/discount.model"
import {
  deleteDiscount,
  getDiscountByCode,
  getDiscountCodes,
  updateDiscount
} from "~/models/repositories/discount.repo"
import { ProductService } from "./product.service"
import { getAllProducts } from "~/models/repositories/product.repo"

type TPayload = {
  limit?: string | number
  page?: string | number
  code?: string
}

type TPayloadGetAllDiscount = Omit<TPayload, "code"> & {
  shopId?: string
}

type TOrder = {
  productId: string
  price: number
  quantity: number
  shopId?: string
}

type TPayloadUseDiscount = {
  code: string
  userId: string
  orders: TOrder[]
}

type TPayloadDelete<T extends string> = Record<T, string | undefined>

type TPayloadCancel<T extends string> = TPayloadDelete<T>

export class DiscountService {
  // z: Create Discount By Shop
  static createDiscount = async ({ shop, payload }: { shop: string; payload: TDiscountAttrs }) => {
    const foundDiscount = await getDiscountByCode(payload.code)
    if (foundDiscount) throw new BadRequestError("Discount already exist!")

    const newDiscount = await DiscountModel.build({ ...payload, shopId: shop })
    if (!newDiscount) throw new InternalServerError("Cannot create new discount!")
    return newDiscount
  }

  // z: Get All Applicable Products
  static getAllApplicableProducts = async ({ code, limit, page }: TPayload) => {
    if (!code) throw new BadRequestError("Discount does not exist!")
    const options = {
      limit,
      page
    }
    const foundDiscount = await getDiscountByCode(code)
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError("Discount is unavailable!")

    if (foundDiscount.apply_type === "all") {
      return await ProductService.getAllProducts({
        shop: foundDiscount.shopId as string,
        ...options
      })
    }

    return await getAllProducts({ _id: { $in: foundDiscount.product_ids } }, options)
  }

  // z: Get All Discount Codes
  static getAllDiscountCodes = async ({ shopId, limit, page }: TPayloadGetAllDiscount) => {
    if (!shopId) throw new BadRequestError("Shop does not exist!")

    return await getDiscountCodes(shopId, limit, page)
  }

  // z: Use Discount
  static useDiscount = async ({ code, userId, orders }: TPayloadUseDiscount) => {
    const foundDiscount = await getDiscountByCode(code)
    if (!foundDiscount || !foundDiscount.isActive) {
      throw new BadRequestError("Discount is unavailable!")
    }

    if (foundDiscount.used_count >= foundDiscount.quantity) throw new GoneError("Discount is out!")

    // get product based on productIds (orders)
    // Check if all orders are published
    // Check if orders and discount code belong to the same shop

    const totalOrderAmount = orders.reduce((total, prod) => total + prod.price * prod.quantity, 0)
    if (totalOrderAmount < foundDiscount.min_order_value)
      throw new BadRequestError(`Order value must be more than ${foundDiscount.min_order_value}!`)

    if (foundDiscount.quantity_per_user < 1) throw new BadRequestError("Discount is unavailable!")

    const userUsedCount = foundDiscount.used_users.reduce(
      (count, id) => (count += Number(id.toString() === userId)),
      0
    )
    if (userUsedCount >= foundDiscount.quantity_per_user)
      throw new BadRequestError("Discount is unusable!")

    // update discount
    await updateDiscount(
      { code: foundDiscount.code, shopId: foundDiscount.shopId },
      {
        $push: { used_users: userId },
        $inc: { used_count: 1 }
      }
    )

    const discount =
      foundDiscount.type === "fixed_amount"
        ? foundDiscount.value
        : (totalOrderAmount * foundDiscount.value) / 100

    return {
      total: totalOrderAmount,
      discount,
      final: totalOrderAmount - discount
    }
  }

  // z: Delete Discount
  static deleteDiscount = async ({ code, shopId }: TPayloadDelete<"code" | "shopId">) => {
    if (!shopId || !code) throw new BadRequestError()

    const result = await deleteDiscount({ code, shopId })
    if (!result) throw new InternalServerError("Cannot delete discount!")

    return result
  }

  // z: Cancel Discount
  static cancelDiscount = async ({ code, userId }: TPayloadCancel<"code" | "userId">) => {
    if (!userId || !code) throw new BadRequestError()

    const foundDiscount = await getDiscountByCode(code)
    if (!foundDiscount) throw new NotFoundError("Discount not found!")

    if (!foundDiscount.used_users.find((id) => id.toString() === userId))
      throw new BadRequestError("Unused discount!")

    const result = await updateDiscount(
      { code: foundDiscount.code, shopId: foundDiscount.shopId },
      {
        $pull: { used_users: { $in: [userId] } },
        $inc: { used_count: -1 }
      }
    )
    if (!result) throw new InternalServerError("Cannot cancel using discount!")

    return result
  }
}
