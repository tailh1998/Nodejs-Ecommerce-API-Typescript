import mongoose from "mongoose"
import { ENVIRONMENT } from "~/constants"
import { countConnect } from "~/helpers/check.connect"
import { logger } from "~/utils/logger"

class Database {
  static instance: any

  constructor() {
    this.connect()
  }

  async connect() {
    if (process.env.NODE_ENV === ENVIRONMENT.DEV) {
      mongoose.set("debug", true)
      mongoose.set("debug", { color: true })
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI ?? "", { dbName: "Shop" })
      const numConnection = countConnect()

      console.log(`:::::Data Base:::::`)
      console.log("Connected Mongodb Success", `Number of connections::::${numConnection}`)
    } catch (error) {
      logger.error("ERR CONNECT!::::")
      logger.error(error)
      process.exit(1)
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }

    return this.instance
  }
}

export default Database
