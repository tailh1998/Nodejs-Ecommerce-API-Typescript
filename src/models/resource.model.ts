import { Schema, model } from "mongoose"
import { TResource, TResourceAttrs, TResourceModel } from "~/@types/model/resource.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const resourceSchema = new Schema<TResource, TResourceModel>(
  {
    srcName: { type: String, require: true },
    srcSlug: { type: String, require: true },
    srcDescription: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.RESOURCES
  }
)

resourceSchema.statics.build = async (attrs: TResourceAttrs): Promise<TResource> => {
  return ResourceModel.create(attrs)
}

export const ResourceModel = model<TResource, TResourceModel>(
  DOCUMENT_NAME.RESOURCE,
  resourceSchema
)
