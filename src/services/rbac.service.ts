import { TResourceAttrs } from "~/@types/model/resource.type"
import { TRoleAttrs } from "~/@types/model/role.type"
import { COLLECTION_NAME } from "~/constants/model"
import { ROLE } from "~/constants/role"
import { BadRequestError } from "~/core/error.response"
import { ResourceModel } from "~/models/resource.model"
import { RoleModel } from "~/models/role.model"

export type GetResourceList = {
  userId?: string
  limit?: number
  offset?: number
  search?: string
}

export type GetRoleList = GetResourceList

// role-base-access-control
export class RbacService {
  static createResource = async ({ srcName, srcSlug, srcDescription }: TResourceAttrs) => {
    try {
      // z: 1. Check name or slug exists
      const existedRole = await RoleModel.findOne({ name })
      if (existedRole) {
        throw new BadRequestError("Role exists")
      }

      // z: 2. new resource
      return await ResourceModel.build({ srcName, srcSlug, srcDescription })
    } catch (error) {
      console.log(error)
      return error
    }
  }

  static resourceList = async ({
    userId,
    limit = 30,
    offset = 0,
    search = ""
  }: GetResourceList) => {
    try {
      // z: 1. check admin or not ? middleware
      console.log(userId, limit, offset, search)

      // z: 2. get list of resource
      return await ResourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: "$srcName",
            slug: "$srcSlug",
            description: "$srcDescription",
            resourceId: "$_id",
            createAt: 1
          }
        }
      ])
    } catch (error) {
      return []
    }
  }

  static createRole = async ({
    name = ROLE.SHOP,
    slug = "s00001",
    description = " extend from shop pr user",
    grants = []
  }: TRoleAttrs) => {
    try {
      // z: 1. check role exists
      const existedRole = await RoleModel.findOne({ name })
      if (existedRole) {
        throw new BadRequestError("Role exists")
      }

      // z: 2. create new role
      return await RoleModel.build({ name, slug, description, grants })
    } catch (error) {
      return error
    }
  }

  static roleList = async ({ userId, limit = 30, offset = 0, search = "" }: GetRoleList) => {
    try {
      // z: 1. check userId [user === ADMIN]
      console.log(userId, limit, offset, search)

      // z: 2. List roles
      const roles = await RoleModel.aggregate([
        {
          $unwind: "$grants"
        },
        {
          $lookup: {
            from: COLLECTION_NAME.RESOURCES,
            localField: "grants.resource",
            foreignField: "_id",
            as: "resource"
          }
        },
        {
          $unwind: "$resource"
        },
        {
          $project: {
            role: "$name",
            resource: "$resource.srcName",
            action: "$grants.actions",
            attributes: "$grants.attributes"
          }
        },
        {
          $unwind: "$action"
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$action",
            attributes: 1
          }
        }
      ])

      return roles
    } catch (error) {
      return error
    }
  }
}
