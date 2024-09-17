import { ObjectId, HydratedDocument, Model } from "mongoose"
import { RoleType } from "~/constants/role"

type Grant = {
  resource: string | ObjectId
  actions: string[]
  attributes: string
}

export type TRawRole = {
  _id: string | ObjectId
  name: RoleType
  slug: string
  status?: "pending" | "active" | "block"
  description?: string
  grants: Grant[]
}

export type TRole = HydratedDocument<TRawRole>

export type TRoleAttrs = Omit<TRawRole, "_id">

export type TRoleModel = Model<TRole> & {
  build(attrs: TRoleAttrs): Promise<TRole>
}
