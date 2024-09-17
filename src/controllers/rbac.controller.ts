import { GetResourceList } from "./../services/rbac.service"
import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { RbacService } from "~/services/rbac.service"

export class RbacController {
  static createNewRole: RequestHandler = async (req, res) => {
    const data = await RbacService.createRole(req.body)

    new OK({
      message: "Create Role Success!",
      metadata: { data }
    }).send(res)
  }

  static createNewResource: RequestHandler = async (req, res) => {
    const data = await RbacService.createResource(req.body)

    new OK({
      message: "Create Resource Success!",
      metadata: { data }
    }).send(res)
  }

  static getResourceList: RequestHandler = async (req, res) => {
    const data = await RbacService.resourceList(req.body)

    new OK({
      message: "Get Resource List Success!",
      metadata: { data }
    }).send(res)
  }

  static getRoleList: RequestHandler = async (req, res) => {
    const data = await RbacService.roleList(req.body)

    new OK({
      message: "Get Role List Success!",
      metadata: { data }
    }).send(res)
  }
}
