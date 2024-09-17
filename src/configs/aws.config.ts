import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3"

const S3_CONFIG = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY || ""
  }
}

const s3 = new S3Client(S3_CONFIG)

export { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand }
