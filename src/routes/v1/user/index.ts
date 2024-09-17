import { Router } from "express"
import { UserController } from "~/controllers/user.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const userRouter = Router()

userRouter.post("/", asyncHandler(UserController.newUser))
userRouter.get("/verify", asyncHandler(UserController.checkLoginEmailToken))

export default userRouter
