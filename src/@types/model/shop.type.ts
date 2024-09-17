import { HydratedDocument, Model } from "mongoose"

type ShopStatus = "active" | "inactive"

type TRawShop = {
  _id: string
  name: string
  email: string
  password: string
  // msisdn: string
  status: ShopStatus
  verify: boolean
  roles: string[]
  createdAt: Date
  updatedAt: Date
}

export type TShop = HydratedDocument<TRawShop>

export type TShopAttrs = {
  name: string
  email: string
  password: string
  // msisdn: string
  status?: ShopStatus
  verify?: boolean
  roles?: string[]
}

export type TShopModel = Model<TShop> & {
  build(attrs: TShopAttrs): Promise<TShop>
}
