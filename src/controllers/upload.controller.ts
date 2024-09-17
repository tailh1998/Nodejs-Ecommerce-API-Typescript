import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { UploadService } from "~/services/upload.service"

export class UploadController {
  // z: ------------- [CLOUDINARY] -------------
  static uploadImage: RequestHandler = async (req, res) => {
    const data = await UploadService.uploadImage({
      userId: req.user.userId,
      file: req.file
    })

    new OK({
      message: "Image uploaded successfully",
      metadata: { data }
    }).send(res)
  }

  static uploadMultipleImages: RequestHandler = async (req, res) => {
    const data = await UploadService.uploadMultipleImages({
      userId: req.user.userId,
      files: req.files as Express.Multer.File[]
    })

    new OK({
      message: "Images uploaded successfully",
      metadata: { data }
    }).send(res)
  }

  // z: ------------- [ S3 ] -------------
  static uploadImageToS3: RequestHandler = async (req, res) => {
    const data = await UploadService.uploadImageToS3(req.file)

    new OK({
      message: "Image uploaded successfully",
      metadata: { data }
    }).send(res)
  }
}
