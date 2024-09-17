import { ValueOf } from "~/@types"

export const ROLE = {
  ADMIN: "240794",
  SHOP: "061298",
  USER: "123456"
} as const

export const ROLE_SLUG = {
  ADMIN: "s00001",
  SHOP: "s00002",
  USER: "s00003"
} as const

export const ROLES = Object.values(ROLE)

export type RoleType = ValueOf<typeof ROLE>
