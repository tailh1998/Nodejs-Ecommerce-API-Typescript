import { Schema, model } from "mongoose"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"
import { TComment, TCommentAttrs, TCommentModel } from "~/@types/model/comment.type"

const commentSchema = new Schema<TComment, TCommentModel>(
  {
    comment_userId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.SHOP,
      required: true
    },
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.PRODUCT.default,
      required: true
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.COMMENT,
      default: null
    },
    comment_left: {
      type: Number,
      required: true
    },
    comment_right: {
      type: Number,
      required: true
    },
    comment_content: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.COMMENTS
  }
)

commentSchema.statics.build = async (attrs: TCommentAttrs): Promise<TComment> => {
  return CommentModel.create(attrs)
}

export const CommentModel = model<TComment, TCommentModel>(DOCUMENT_NAME.COMMENT, commentSchema)
