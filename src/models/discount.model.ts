import { Schema, Types, model } from "mongoose"
import { TDiscount, TDiscountAttrs, TDiscountModel } from "~/@types/model/discount.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const discountSchema = new Schema<TDiscount, TDiscountModel>(
  {
    name: { type: String, required: true },
    description: { type: String, require: true },
    type: {
      type: String,
      enum: ["fixed_amount", "percentage"],
      default: "fixed_amount"
    },
    code: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    used_count: { type: Number, required: true, default: 0 },
    used_users: { type: [Types.ObjectId], required: true, default: [] },
    quantity_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shopId: { type: Types.ObjectId, required: true, ref: DOCUMENT_NAME.SHOP },
    isActive: { type: Boolean, required: true, default: true },
    apply_type: { type: String, enum: ["all", "specific"], required: true },
    product_ids: {
      type: [Types.ObjectId],
      required: true,
      default: [],
      ref: DOCUMENT_NAME.PRODUCT.default
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.DISCOUNTS,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        return ret
      }
    }
  }
)

discountSchema.statics.build = async (attrs: TDiscountAttrs): Promise<TDiscount> => {
  return DiscountModel.create(attrs)
}

export const DiscountModel = model<TDiscount, TDiscountModel>(
  DOCUMENT_NAME.DISCOUNT,
  discountSchema
)
