import { RequestHandler } from "express"
import { Permission, Query } from "accesscontrol"
import { AuthFailureError } from "~/core/error.response"
import { RbacService } from "~/services/rbac.service"

import accessControl from "./role.middleware"

type Action =
  | "create:any"
  | "read:any"
  | "update:any"
  | "delete:any"
  | "create:own"
  | "read:own"
  | "update:own"
  | "delete:own"

type Resource = string

const convertAction = (action: Action): keyof Query => {
  return action.replace(/:(\w)/, (_, char) => char.toUpperCase()) as keyof Query
}

const grantAccess = (action: Action, resource: Resource) => {
  const checkRole: RequestHandler = async (req, _, next) => {
    try {
      accessControl.setGrants(await RbacService.roleList({}))
      const roleName = req.query.role as string
      const convertedAction = convertAction(action)
      const permission = accessControl.can(roleName)[convertedAction](resource) as Permission

      if (!permission.granted) {
        throw new AuthFailureError("You don't have enough permissions...")
      }

      next()
    } catch (error) {
      next(error)
    }
  }

  return checkRole
}

export default grantAccess
