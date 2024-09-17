import { RequestHandler } from "express"
import AccessService from "~/services/access.service"
import { CREATED, SuccessResponse } from "~/core/success.response"

class AccessController {
  signUp: RequestHandler = async (req, res) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }

  login: RequestHandler = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  logout: RequestHandler = async (req, res) => {
    new SuccessResponse({
      message: "Logout Success !!!",
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  renewToken: RequestHandler = async (req, res) => {
    new SuccessResponse({
      message: "Get token success!!!",
      metadata: await AccessService.renewToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })
    }).send(res)
  }
}

export default new AccessController()
