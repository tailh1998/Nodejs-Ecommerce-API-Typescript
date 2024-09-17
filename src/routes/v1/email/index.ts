import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { EmailController } from "~/controllers/email.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const emailRouter = Router()

emailRouter.use(authentication)

emailRouter.post("/template", asyncHandler(EmailController.newTemplateMail))

export default emailRouter
