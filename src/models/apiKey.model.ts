import { Schema, model } from "mongoose"
import { TApiKey, TApiKeyModel } from "~/@types/model/apiKey.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema<TApiKey, TApiKeyModel>(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"] // TODO: fix after
    }
  },
  {
    timestamps: true,
    versionKey: false, // exclude __v
    collection: COLLECTION_NAME.API_KEYS
  }
)

//Export the model
const apiKeyModel = model(DOCUMENT_NAME.API_KEY, apiKeySchema)

export default apiKeyModel
