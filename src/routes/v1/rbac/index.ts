import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { RbacController } from "~/controllers/rbac.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const rbacRouter = Router()
const { createNewResource, createNewRole, getResourceList, getRoleList } = RbacController

rbacRouter.use(authentication)

rbacRouter.post("/role", asyncHandler(createNewRole))
rbacRouter.get("/roles", asyncHandler(getRoleList))

rbacRouter.post("/resource", asyncHandler(createNewResource))
rbacRouter.get("/resources", asyncHandler(getResourceList))

export default rbacRouter
