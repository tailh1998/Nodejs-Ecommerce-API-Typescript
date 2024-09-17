import { ObjectId, HydratedDocument, Model } from "mongoose"

export type TRawDiscount = {
  _id: string
  name: string
  description: string
  type: "fixed_amount" | "percentage"
  code: string
  value: number
  start_date: Date
  end_date: Date
  quantity: number
  used_count: number
  used_users: ObjectId[]
  quantity_per_user: number
  min_order_value: number
  shopId: string | ObjectId
  isActive: boolean
  apply_type: "all" | "specific"
  product_ids: ObjectId[]
}

export type TDiscount = HydratedDocument<TRawDiscount>

export type TDiscountAttrs = Omit<
  TRawDiscount,
  "_id" | "used_count" | "used_user" | "isActive" | "product_ids"
>

export type TDiscountModel = Model<TDiscount> & {
  build(attrs: TDiscountAttrs): Promise<TDiscount>
}
