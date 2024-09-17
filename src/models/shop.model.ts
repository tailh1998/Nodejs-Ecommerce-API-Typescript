import { Schema, model } from "mongoose"
import { TShop, TShopModel } from "~/@types/model/shop.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

// Declare the Schema of the Mongo model
const shopSchema = new Schema<TShop, TShopModel>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150
    },
    email: {
      type: String,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive"
    },
    verify: {
      type: Boolean,
      default: false
    },
    roles: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false, // exclude __v
    collection: COLLECTION_NAME.SHOPS
  }
)

//Export the model
const shopModel = model(DOCUMENT_NAME.SHOP, shopSchema)

export default shopModel
