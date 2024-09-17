import { Router } from "express"

import { authentication } from "~/auth/auth.utils"
import { NotificationController } from "~/controllers/notification.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const notiRouter = Router()

notiRouter.use(authentication)

notiRouter.get("/", asyncHandler(NotificationController.getNotifications))

module.exports = notiRouter
