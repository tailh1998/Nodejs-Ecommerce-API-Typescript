import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { CommentController } from "~/controllers/comment.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const commentRouter = Router()

commentRouter.get("/", asyncHandler(CommentController.getCommentThread))

commentRouter.use(authentication)

commentRouter.post("/", asyncHandler(CommentController.createComment))
commentRouter.delete("/", asyncHandler(CommentController.deleteComment))

export default commentRouter
