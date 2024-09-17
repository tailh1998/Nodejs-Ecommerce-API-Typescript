import { Schema, Types, model } from "mongoose"
import { TCart, TCartAttrs, TCartModel } from "~/@types/model/cart.type"
import { STATE } from "~/constants/cart"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const cartSchema = new Schema<TCart, TCartModel>(
  {
    userId: { type: Types.ObjectId, required: true, ref: DOCUMENT_NAME.SHOP },
    state: {
      type: String,
      enum: [STATE.ACTIVE, STATE.COMPLETED, STATE.FAILED, STATE.PENDING],
      required: true,
      default: STATE.ACTIVE
    },
    /**
     * [
     *  {
     *      productId,
     *      shopId,
     *      quantity
     *  }
     * ]
     */
    products: { type: [Object], default: [] },
    total_count: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn"
    },
    collection: COLLECTION_NAME.CARTS
  }
)

cartSchema.statics.build = async (attrs: TCartAttrs) => {
  return CartModel.create(attrs)
}

export const CartModel = model<TCart, TCartModel>(DOCUMENT_NAME.CART, cartSchema)
