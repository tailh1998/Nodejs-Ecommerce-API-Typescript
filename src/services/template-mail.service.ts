import { TTemplateMailAttrs } from "~/@types/model/template-mail.model"
import { BadRequestError } from "~/core/error.response"
import { TemplateMailModel } from "~/models/template-mail.model"
import { getTemplateMailHtml } from "~/utils/template-mail.html"

export class TemplateMailService {
  static newTemplateMail = async ({ name }: TTemplateMailAttrs) => {
    // z: 1. check template exists
    const templateExists = await this.getTemplateMail(name)
    if (templateExists) {
      throw new BadRequestError("::[ERROR]::Template already registered!")
    }

    // z: 2. create a new template
    return await TemplateMailModel.build({ name, html: getTemplateMailHtml() })
  }

  static getTemplateMail = async (name: string) => {
    return await TemplateMailModel.findOne({ name })
  }
}
