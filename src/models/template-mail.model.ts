import { Schema, model } from "mongoose"
import {
  TTemplateMail,
  TTemplateMailAttrs,
  TTemplateMailModel
} from "~/@types/model/template-mail.model"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"

const templateMailSchema = new Schema<TTemplateMail, TTemplateMailModel>(
  {
    templateId: { type: Number, default: null },
    name: { type: String, required: true },
    status: { type: String, default: "active", enum: ["pending", "active", "block"] },
    html: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.TEMPLATE_MAILS
  }
)

templateMailSchema.statics.build = async (attrs: TTemplateMailAttrs): Promise<TTemplateMail> => {
  return TemplateMailModel.create(attrs)
}

export const TemplateMailModel = model<TTemplateMail, TTemplateMailModel>(
  DOCUMENT_NAME.TEMPLATE_MAIL,
  templateMailSchema
)
