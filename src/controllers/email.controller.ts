import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { TemplateMailService } from "~/services/template-mail.service"

export class EmailController {
  static newTemplateMail: RequestHandler = async (req, res) => {
    new OK({
      message: "Create New Template Mail Success !!!",
      metadata: await TemplateMailService.newTemplateMail(req.body)
    }).send(res)
  }
}
