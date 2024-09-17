import { HydratedDocument, Model, ObjectId } from "mongoose"

type TCheckout = {
  totalPrice: number
  shipping: number
  totalDiscount: number
  final: number
}

type TShipping = {
  street: string
  city: string
  state: string
  country: string
}

export type TRawOrder = {
  _id: string | ObjectId
  userId: string | ObjectId
  trackingNumber: string
  checkout: TCheckout
  shipping: TShipping
  status: string
  // Z: I will update the type for this later.
  payment: Record<string, any>
  products: any
}

export type TOrder = HydratedDocument<TRawOrder>

export type TOrderAttrs = Omit<TRawOrder, "trackingNumber" | "_id" | "userId">

export type TOrderModel = Model<TOrder> & {
  build(attrs: TOrderAttrs): Promise<TOrder>
}
