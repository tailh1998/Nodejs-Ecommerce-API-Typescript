import { ObjectId, HydratedDocument, Model } from "mongoose"

export type TRawTemplateMail = {
  _id: string | ObjectId
  templateId: number | null
  name: string
  status?: "pending" | "active" | "block"
  html: string
}

export type TTemplateMail = HydratedDocument<TRawTemplateMail>

export type TTemplateMailAttrs = Omit<TRawTemplateMail, "_id" | "templateId">

export type TTemplateMailModel = Model<TTemplateMail> & {
  build(attrs: TTemplateMailAttrs): Promise<TTemplateMail>
}
