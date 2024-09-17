import { DecodeUser } from "./model/keyToken.type"
import { KeyStoreParam } from "./auth.type"

declare global {
  namespace Express {
    interface Request {
      refreshToken?: string
      user: DecodeUser
      keyStore?: KeyStoreParam
      requestId: string
    }
  }
}
