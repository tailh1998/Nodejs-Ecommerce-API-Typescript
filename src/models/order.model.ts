import { Schema, model } from "mongoose"
import { TOrder, TOrderAttrs, TOrderModel } from "~/@types/model/order.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const orderSchema = new Schema<TOrder, TOrderModel>(
  {
    userId: {
      type: Number,
      required: true
    },
    /**
     * checkout : {
     *      totalPrice
     *      shipping
     *      totalDiscount
     *      final
     * }
     */
    checkout: {
      type: Object,
      default: {}
    },
    /**
     * shipping : {
     *      street
     *      city
     *      state
     *      country
     * }
     */
    shipping: {
      type: Object,
      default: {}
    },
    payment: {
      type: Object,
      default: {}
    },
    products: {
      type: Array,
      required: true
    },
    trackingNumber: {
      type: String,
      default: "#0000118052022"
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn"
    },
    collection: COLLECTION_NAME.ORDERS
  }
)

orderSchema.statics.build = async (attrs: TOrderAttrs) => {
  return OrderModel.create(attrs)
}

export const OrderModel = model<TOrder, TOrderModel>(DOCUMENT_NAME.ORDER, orderSchema)
