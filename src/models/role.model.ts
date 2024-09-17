import { Schema, model } from "mongoose"
import { TRole, TRoleAttrs, TRoleModel } from "~/@types/model/role.type"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"
import { ROLE, ROLES } from "~/constants/role"

// z: grants
// const grantList = [
//   { role: ROLE.ADMIN, resource: "profile", action: "update:any", attributes: "*" },
//   { role: ROLE.ADMIN, resource: "balance", action: "update:any", attributes: "*, !mount" },

//   { role: ROLE.SHOP, resource: "profile", action: "update:own", attributes: "*" },
//   { role: ROLE.SHOP, resource: "balance", action: "update:own", attributes: "*, !mount" }
// ]

const roleSchema = new Schema<TRole, TRoleModel>(
  {
    name: { type: String, default: ROLE.USER, enum: ROLES },
    slug: { type: String, require: true },
    status: { type: String, default: "active", enum: ["pending", "active", "block"] },
    description: { type: String, default: "" },
    grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: DOCUMENT_NAME.RESOURCE,
          require: true
        },
        actions: [{ type: String, require: true }],
        attributes: { type: String, default: "*" }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.ROLES
  }
)

roleSchema.statics.build = async (attrs: TRoleAttrs): Promise<TRole> => {
  return RoleModel.create(attrs)
}

export const RoleModel = model<TRole, TRoleModel>(DOCUMENT_NAME.ROLE, roleSchema)
