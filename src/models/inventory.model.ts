import { Schema, Types, model } from "mongoose"

import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"
import { TInventory, TInventoryAttrs, TInventoryModel } from "~/@types/model/inventory.type"

const inventorySchema = new Schema<TInventory, TInventoryModel>(
  {
    productId: { type: Types.ObjectId, required: true },
    shopId: { type: Types.ObjectId, required: true },
    stock: {
      type: Number,
      require: true,
      min: [0, "Stock must be positive"],
      set: (val: number) => Math.floor(val)
    },
    location: { type: String, default: "unknown" },
    reservations: { type: [Object], default: [] }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.INVENTORIES
  }
)

inventorySchema.statics.build = async (attrs: TInventoryAttrs) => {
  return InventoryModel.create(attrs)
}

export const InventoryModel = model<TInventory, TInventoryModel>(
  DOCUMENT_NAME.INVENTORY,
  inventorySchema
)
