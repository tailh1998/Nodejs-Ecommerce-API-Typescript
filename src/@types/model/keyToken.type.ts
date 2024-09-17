export type CreateKeyTokenParams = {
  userId: string
  publicKey: string
  privateKey: string
  refreshToken?: string
}

export type DecodeUser = {
  userId: string
  email: string
}
