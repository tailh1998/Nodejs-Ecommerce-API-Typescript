import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { CommentService } from "~/services/comment.service"

export class CommentController {
  static createComment: RequestHandler = async (req, res) => {
    const data = await CommentService.createComment({
      ...req.body,
      comment_userId: req.user.userId
    })

    new OK({
      message: "Create comment successfully",
      metadata: { data }
    }).send(res)
  }

  static getCommentThread: RequestHandler = async (req, res) => {
    const data = await CommentService.getCommentThread({
      productId: req.query.productId as string,
      commentId: req.query.commentId as string
    })

    new OK({
      message: "Get comments successfully!",
      metadata: { data }
    }).send(res)
  }

  static deleteComment: RequestHandler = async (req, res) => {
    const payload = {
      userId: req.user.userId,
      commentId: req.query.commentId as string,
      productId: req.query.productId as string
    }
    const data = await CommentService.deleteComment(payload)

    new OK({
      message: "Delete comment successfully!",
      metadata: { data }
    }).send(res)
  }
}
