import { InternalServerError, NotFoundError } from "~/core/error.response"
import { OtpService } from "./otp.service"
import { TemplateMailService } from "./template-mail.service"
import { transport } from "~/configs/node-mailer.config"
import LoggerV2 from "~/utils/logger.v2"
import { omit } from "lodash"
import { replacePlaceholder } from "~/utils"
import { TEMPLATE_MAIL_NAMES } from "~/constants/mail"

export class EmailService {
  static sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = "Confirm email register !!!"
  }: Record<"html" | "toEmail" | "subject", string>) => {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.APP_EMAIL}>`,
        to: toEmail,
        subject,
        html
      }

      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
          LoggerV2.error(`Fail with::: ${JSON.stringify(err)}`, omit(mailOptions, "html"))
        } else {
          LoggerV2.log(`Send mail success with::: ${JSON.stringify(info)}`)
        }
      })
    } catch (error) {
      throw new InternalServerError(`Send email fail with ${error}`)
    }
  }

  static sendEmailToken = async (email: string) => {
    try {
      // z: 1. get token
      const { token } = await OtpService.newOtp(email)
      LoggerV2.log(`Regis Token::: ${token}`)
      if (!token) {
        throw new NotFoundError(`Create token fail with ${email}`)
      }

      // z: 2. get template
      const template = await TemplateMailService.getTemplateMail(TEMPLATE_MAIL_NAMES.REGISTER)
      if (!template) {
        throw new NotFoundError("Template Mail Not Found !!!")
      }

      const port = Number(process.env.PORT ?? 8017)
      const hostname = process.env.HOST

      // z: 3. replace placeholder with params
      const content = replacePlaceholder(template.html, {
        link_verify: `http://${hostname}:${port}/v1/api/user/verify?token=${token}` // ! This url just a test for local env
      })

      // z: 4. send email
      await this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: "Please confirm your email address !!!"
      })

      return 1 // Everything is OK
    } catch (error) {
      throw new InternalServerError(`Send email token fail with ${error}`)
    }
  }
}
