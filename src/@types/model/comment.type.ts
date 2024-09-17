import { HydratedDocument, Model, ObjectId } from "mongoose"

export type TRawComment = {
  _id: string
  comment_userId: string | ObjectId
  comment_productId: string | ObjectId
  comment_parentId: string | ObjectId
  comment_left: number
  comment_right: number
  comment_content: string
  isDeleted: boolean
}

export type TCommentAttrs = {
  comment_userId: string
  comment_productId: string
  comment_parentId: string
  comment_left: number
  comment_right: number
  comment_content: string
}

export type TComment = HydratedDocument<TRawComment>

export type TCommentModel = Model<TComment> & {
  build(attrs: TCommentAttrs): Promise<TComment>
}
