import apiKeyModel from "~/models/apiKey.model"

export const insertTestApiKey = async () => {
  const key =
    "40e04caa171e0a8d03ac439d1f9a124681be24cb73290a49faab88a706f0679496b0b19f449c125e5ffb14f776e7814ed4b8f06e38a9e92e0dba2f6fb4fcda60"
  await apiKeyModel.create({
    key,
    permissions: ["0000"]
  })
}

export const findKeyById = async (key?: string) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
  return objKey
}
