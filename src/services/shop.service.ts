import { SelectData } from "~/@types"
import shopModel from "~/models/shop.model"
import { getSelectData } from "~/utils"

const SELECT_DEFAULT = ["email", "password", "name", "status", "roles"]

export const findByEmail = async ({
  email,
  select = getSelectData(SELECT_DEFAULT)
}: {
  email: string
  select?: SelectData
}) => await shopModel.findOne({ email }).select(select).lean()

export const findShopById = async (id: string) => await shopModel.findById(id).lean()
