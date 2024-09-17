import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { InventoryController } from "~/controllers/inventory.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const inventoryRouter = Router()

inventoryRouter.use(authentication)

inventoryRouter.post("/", asyncHandler(InventoryController.addStockToInventory))

export default inventoryRouter
