import slugify from "slugify"
import { Schema, model } from "mongoose"

import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"
import {
  TClothing,
  TElectronic,
  TFurniture,
  TProductModel,
  TProduct
} from "~/@types/model/product.type"
import { TShopAttrs } from "~/@types/model/shop.type"

const productSchema = new Schema<TProduct, TProductModel>(
  {
    product_name: {
      type: String,
      trim: true,
      maxLength: 150
    },
    product_thumb: {
      type: String,
      trim: true
    },
    product_description: {
      type: String
    },
    product_slug: String,
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"]
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop"
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    // more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val: number) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: [String],
      default: []
    },
    product_isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false // Unselectable field
    },
    product_isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false // Unselectable field
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false // Unselectable field
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.PRODUCTS.default
  }
)

const clothingSchema = new Schema<TClothing, TProductModel>(
  {
    product_brand: { type: String, required: true },
    product_size: String,
    product_material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.SHOP
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    collection: COLLECTION_NAME.PRODUCTS.clothings,
    timestamps: true
  }
)

const electronicSchema = new Schema<TElectronic, TProductModel>(
  {
    product_manufacturer: { type: String, required: true },
    product_model: String,
    product_color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.SHOP
    },
    product_deletedAt: {
      type: Schema.Types.Date,
      default: null,
      select: false
    }
  },
  {
    collection: COLLECTION_NAME.PRODUCTS.electronics,
    timestamps: true
  }
)

const furnitureSchema = new Schema<TFurniture, TProductModel>(
  {
    product_brand: { type: String, required: true },
    product_size: String,
    product_material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.SHOP
    },
    product_deletedAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    collection: COLLECTION_NAME.PRODUCTS.furnitures,
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        return ret
      }
    }
  }
)

productSchema.index({
  name: "text",
  description: "text",
  "attributes.manufacturer": "text",
  "attributes.brand": "text",
  thumb: -1
})

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

productSchema.statics.build = async (attrs: TShopAttrs) => {
  return ProductModel.create(attrs)
}

const ProductModel = model<TProduct, TProductModel>(DOCUMENT_NAME.PRODUCT.default, productSchema)
const ClothingModel = model<TClothing, TProductModel>(
  DOCUMENT_NAME.PRODUCT.clothing,
  clothingSchema
)
const FurnitureModel = model<TFurniture, TProductModel>(
  DOCUMENT_NAME.PRODUCT.furniture,
  furnitureSchema
)
const ElectronicModel = model<TElectronic, TProductModel>(
  DOCUMENT_NAME.PRODUCT.electronic,
  electronicSchema
)

export { ProductModel, ClothingModel, FurnitureModel, ElectronicModel }
