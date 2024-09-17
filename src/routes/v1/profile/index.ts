import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { ProfileController } from "~/controllers/profile.controller"
import { asyncHandler } from "~/middleware/error.middleware"
import grantAccess from "~/middleware/role/rbac.middleware"

const profileRouter = Router()

profileRouter.use(authentication)

profileRouter.get(
  "/view-any",
  grantAccess("read:any", "profile"),
  asyncHandler(ProfileController.getProfiles)
)
profileRouter.get(
  "/view-own",
  grantAccess("read:own", "profile"),
  asyncHandler(ProfileController.getProfile)
)

export default profileRouter
