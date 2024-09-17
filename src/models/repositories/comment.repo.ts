import { CommentModel } from "../comment.model"
import { Types } from "mongoose"
import { TCommentAttrs } from "~/@types/model/comment.type"
import { COLLECTION_NAME } from "~/constants/model"

const createComment = async (comment: TCommentAttrs) => await CommentModel.build(comment)

const getComments = async ({
  productId,
  commentId
}: {
  productId?: string
  commentId?: string
}) => {
  const match = commentId
    ? { $match: { _id: new Types.ObjectId(commentId) } }
    : {
        $match: { comment_productId: new Types.ObjectId(productId) }
      }

  const thread = await CommentModel.aggregate([
    match,
    {
      $lookup: {
        from: COLLECTION_NAME.COMMENTS,
        let: {
          left: "$comment_left",
          right: "$comment_right",
          productId: "$comment_productId"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $gt: ["$comment_left", "$$left"] },
                  { $lt: ["$comment_right", "$$right"] },
                  { $eq: ["$comment_productId", "$$productId"] }
                ]
              }
            }
          },
          {
            $sort: { comment_left: 1 }
          },
          {
            $limit: 5
          }
        ],
        as: "repliedComments"
      }
    }
  ])

  return thread[0] ? thread[0] : {}
}

const getCommentById = async (id: string) => await CommentModel.findById(id)

const deleteComment = async (id: string) => await CommentModel.findByIdAndDelete(id)

export { createComment, getComments, getCommentById, deleteComment }
