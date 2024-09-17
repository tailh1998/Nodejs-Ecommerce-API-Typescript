import { HydratedDocument, Model, ObjectId } from "mongoose"

export type TReservation = {
  userId: string | ObjectId
  quantity: number
  createdAt: Date
}

export type TRawInventory = {
  _id: string | ObjectId
  productId: string | ObjectId
  shopId: string | ObjectId
  location: string
  stock: number
  reservations: TReservation[]
}

export type TInventory = HydratedDocument<TRawInventory>

export type TInventoryAttrs = Omit<TRawInventory, "reservations" | "_id">

export type TInventoryModel = Model<TInventory> & {
  build(attrs: TInventoryAttrs): Promise<TInventory>
}
