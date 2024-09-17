import { Document, Types } from "mongoose"
import { IKeyToken } from "~/models/keyToken.model"

export type KeyStoreParam = Document<unknown, {}, IKeyToken> &
  IKeyToken & {
    _id: Types.ObjectId
  }
