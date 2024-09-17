import crypto from "crypto"
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"
import { PutObjectCommand, s3 } from "~/configs/aws.config"
import cloudinary from "~/configs/cloudinary.config"
import { BadRequestError, InternalServerError } from "~/core/error.response"

type TMediaCategory = "product" | "avatar" | "system"

export class UploadService {
  // z: ------------- [CLOUDINARY] -------------
  static uploadImage = async ({
    userId,
    file,
    category = "product"
  }: {
    userId: string
    file?: Express.Multer.File
    category?: TMediaCategory
  }) => {
    if (!file) {
      throw new BadRequestError("No file uploaded")
    }

    try {
      const folderName = `${category}/${userId}`
      const result = await cloudinary.uploader.upload(file.path, {
        format: "jpg",
        folder: folderName
      })

      // Optionally delete the file after successful upload
      // fs.unlinkSync(file.path)

      return {
        image_url: result.secure_url,
        userId
      }
    } catch (error) {
      throw new InternalServerError("Failed to upload image: " + error)
    }
  }

  static uploadMultipleImages = async ({
    userId,
    files,
    category = "product"
  }: {
    userId: string
    files?: Express.Multer.File[]
    category?: TMediaCategory
  }) => {
    if (!files || files.length === 0) {
      throw new BadRequestError("No file uploaded")
    }

    console.log(files)

    try {
      const promises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: `${category}/${userId}`,
          format: "jpg",
          use_filename: true
        })
      )

      const results = await Promise.all(promises)

      // Optionally delete the file after successful upload
      // files.forEach((file) => fs.unlinkSync(file.path));

      return results.map((result) => ({
        image_url: result.secure_url,
        shopId: userId
      }))
    } catch (error: any) {
      throw new InternalServerError("Failed to upload images: " + error.message)
    }
  }
  // z: ------------- [END OF CLOUDINARY] -------------

  // z: ------------- [S3-CLIENT] -------------
  static uploadImageToS3 = async (file?: Express.Multer.File) => {
    if (!file) {
      throw new BadRequestError("No file uploaded")
    }
    const randomName = crypto.randomBytes(6).toString("hex")
    const imageName = `${Date.now()}-${randomName}-${file.originalname || "unknown"}`
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: "image/jpeg"
      })

      await s3.send(command)

      // z: URL should be https
      const cloudFrontUrl = `https://${process.env.AWS_CLOUD_FRONT}/${imageName}`

      //z: Get Public Image Url From S3
      // const signedUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: imageName
      // })

      // const publicUrlFromS3 = await getSignedUrl(s3, signedUrl, {
      //   expiresIn: 3600
      // })

      //z: Get Public Image Url From CloudFront
      const publicUrlFromCloudFront = getSignedUrl({
        url: cloudFrontUrl,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minute
        keyPairId: process.env.AWS_CLOUD_FRONT_PUBLIC_KEY || "",
        privateKey: process.env.AWS_CLOUD_FRONT_PRIVATE_KEY || ""
      })

      return publicUrlFromCloudFront
    } catch (error) {
      throw new InternalServerError("Failed to upload image use S3 CLIENT: " + error)
    }
  }

  // z: ------------- [END OF S3-CLIENT] -------------
}
