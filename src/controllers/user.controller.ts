import { RequestHandler } from "express"
import { CREATED, OK } from "~/core/success.response"
import { UserService } from "~/services/user.service"

export class UserController {
  static newUser: RequestHandler = async (req, res) => {
    new OK({
      message: "Send token to email's user success !!!",
      metadata: await UserService.newUser(req.body)
    }).send(res)
  }

  static checkLoginEmailToken: RequestHandler = async (req, res) => {
    new CREATED({
      message: "Check token login via email success!",
      metadata: await UserService.checkLoginEmailToken(req.query.token as string)
    }).send(res)
  }
}
