import crypto from "crypto"

export const generateTokens = () => {
  const privateKey = crypto.randomBytes(64).toString("hex")
  const publicKey = crypto.randomBytes(64).toString("hex")

  return {
    privateKey,
    publicKey
  }
}

export const generateRandomToken = () => crypto.randomInt(0, Math.pow(2, 32))
