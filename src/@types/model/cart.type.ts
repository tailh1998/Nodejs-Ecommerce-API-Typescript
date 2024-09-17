import { ValueOf } from "~/@types"
import { HydratedDocument, Model, ObjectId } from "mongoose"
import { STATE } from "~/constants/cart"

export type TCartProduct = {
  productId: string | ObjectId
  shopId: string | ObjectId
  quantity: number
  old_quantity?: number
}

export type TRawCart = {
  _id: string | ObjectId
  state: ValueOf<typeof STATE>
  products: TCartProduct[]
  total_count: number
  userId: string | ObjectId
}

export type TCart = HydratedDocument<TRawCart>

export type TCartAttrs = Omit<TRawCart, "_id" | "total_count" | "products"> & {
  products?: TCartProduct[]
  total_count?: number
}

export type TCartModel = Model<TCart> & {
  build(attrs: TCartAttrs): Promise<TCart>
}
