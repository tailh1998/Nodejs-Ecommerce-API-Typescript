import { ObjectId, HydratedDocument, Model } from "mongoose"

export type TRawResource = {
  _id: string | ObjectId
  srcName: string
  srcSlug: string
  srcDescription: string
}

export type TResource = HydratedDocument<TRawResource>

export type TResourceAttrs = Omit<TRawResource, "_id">

export type TResourceModel = Model<TResource> & {
  build(attrs: TResourceAttrs): Promise<TResource>
}
