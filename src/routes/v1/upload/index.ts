import { Router } from "express"

import { diskStorage, memoryStorage } from "~/configs/multer.config"
import { authentication } from "~/auth/auth.utils"
import { UploadController } from "~/controllers/upload.controller"
import { asyncHandler } from "~/middleware/error.middleware"

const uploadRouter = Router()

uploadRouter.use(authentication)

// z: ------------- [CLOUDINARY] -------------
uploadRouter.post("/", diskStorage.single("file"), asyncHandler(UploadController.uploadImage))

uploadRouter.post(
  "/multiple",
  diskStorage.array("files", 10),
  UploadController.uploadMultipleImages
)

// z: ------------- [ S3 ] -------------
uploadRouter.post(
  "/s3/",
  memoryStorage.single("file"),
  asyncHandler(UploadController.uploadImageToS3)
)

export default uploadRouter
