import { Schema, model } from "mongoose"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

export interface IKeyToken {
  user: Schema.Types.ObjectId
  publicKey: string
  privateKey: string
  refreshTokensUsed?: string[]
  refreshToken?: string
}

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema<IKeyToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: DOCUMENT_NAME.SHOP
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshTokensUsed: {
      type: [String],
      default: []
    },
    refreshToken: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false, // exclude __v
    collection: COLLECTION_NAME.KEYS
  }
)

//Export the model
const keyTokenModel = model(DOCUMENT_NAME.KEY, keyTokenSchema)

export default keyTokenModel
