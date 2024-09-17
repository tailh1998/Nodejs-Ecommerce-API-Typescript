import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
  host: process.env.AWS_EMAIL_HOST,
  port: Number(process.env.AWS_EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.AWS_EMAIL_USER,
    pass: process.env.AWS_EMAIL_PASSWORD
  }
})
