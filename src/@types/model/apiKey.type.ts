import { Model, HydratedDocument } from "mongoose"

type TRawApiKey = {
  _id: string
  key: string
  status: boolean
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export type TApiKey = HydratedDocument<TRawApiKey>

export type TApiKeyAttrs = {
  key: string
  permissions: string[]
}

export type TApiKeyModel = Model<TApiKey> & {
  build(attrs: TApiKeyAttrs): Promise<TApiKey>
}
