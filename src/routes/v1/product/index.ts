import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import { ProductController } from "~/controllers/product.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const productRouter = Router()

productRouter.get("/search/:search", asyncHandler(ProductController.searchProducts))
productRouter.get("/details/:productId", asyncHandler(ProductController.getProductDetails))
productRouter.get("/", asyncHandler(ProductController.getAllProducts))

// z: Authentication Middleware
productRouter.use(authentication)

productRouter.patch("/publish/:productId", asyncHandler(ProductController.publishProduct))
productRouter.patch("/unpublish/:productId", asyncHandler(ProductController.unpublishProduct))
productRouter.patch("/update/:productId", asyncHandler(ProductController.updateProduct))
productRouter.patch("/delete/:productId", asyncHandler(ProductController.deleteProduct))
productRouter.patch("/restore/:productId", asyncHandler(ProductController.restoreProduct))

productRouter.delete("/:productId", asyncHandler(ProductController.destroyProduct))

productRouter.get("/published", asyncHandler(ProductController.getAllPublished))
productRouter.get("/deleted", asyncHandler(ProductController.getAllDeleted))
productRouter.get("/draft", asyncHandler(ProductController.getAllDrafts))
productRouter.get("/:productId", ProductController.getProductDetailsForShop)
productRouter.post("/", asyncHandler(ProductController.createProduct))

export default productRouter
