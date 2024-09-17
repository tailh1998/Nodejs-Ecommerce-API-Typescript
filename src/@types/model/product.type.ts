import { HydratedDocument, Model, ObjectId } from "mongoose"

type ProductType = "Electronic" | "Clothing" | "Furniture"

export type TRawProduct = {
  _id: string | ObjectId
  product_name: string
  product_thumb: string
  product_description?: string
  product_slug?: string
  product_price: number
  product_quantity: number
  product_type: ProductType
  product_shop: string | ObjectId
  product_attributes: Omit<TRawClothing | TRawElectronic | TRawFurniture, "shop">
  product_ratingsAverage: Number
  product_variations: string[]
  product_isDraft: boolean
  product_isPublished: boolean
  product_deletedAt?: Date | null
}

export type TRawClothing = {
  _id: string
  product_brand: string
  product_size: string
  product_material: string
  product_shop: string | ObjectId
  product_deletedAt?: Date
}

export type TRawElectronic = {
  _id: string
  product_manufacturer: string
  product_model: string
  product_color: string
  product_shop: string | ObjectId
  product_deletedAt?: Date
}

export type TRawFurniture = {
  _id: string
  product_brand: string
  product_size: string
  product_material: string
  product_shop: string | ObjectId
  product_deletedAt?: Date
}

export type TProduct = HydratedDocument<TRawProduct>
export type TClothing = HydratedDocument<TRawClothing>
export type TFurniture = HydratedDocument<TRawFurniture>
export type TElectronic = HydratedDocument<TRawElectronic>

export type TProductAttrs = {
  _id?: string
  name: string
  price: number
  quantity: number
  type: ProductType
  shop: string | ObjectId
  attributes: Omit<TRawClothing | TRawElectronic | TRawFurniture, "shop">
  isDraft?: boolean
  isPublished?: boolean
}

export type TProductModel = Model<TProduct> & {
  build(attrs: TProductAttrs): Promise<TProduct>
}
