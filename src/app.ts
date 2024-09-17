import express from "express"
import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { json, urlencoded } from "body-parser"
import "dotenv/config"

import { logger } from "~/utils/logger"
import { corsOptions } from "~/configs/cors.config"
import { ENVIRONMENT } from "~/constants"
import { checkOverload } from "~/helpers/check.connect"
import errorHandler from "~/middleware/error.middleware"
import logRequest from "./middleware/log.middleware"
import MONGO_DB from "~/configs/database.config"
import WELCOME from "~/routes"
import ROUTER_V1 from "~/routes/v1"

/**
 * Creates an express instance.
 *
 * @param {string} env - environment in which the app will run.
 */
const START_SERVER = (env: string) => {
  logger.debug(`App running as ${env}`)
  const app = express()

  // z: ------------- MIDDLEWARES ------------- //
  env === ENVIRONMENT.PRODUCTION && app.disable("x-powered-by")
  app.use(logRequest)
  app.use(morgan("dev"))
  app.use(helmet())
  app.use(compression())
  app.use(json())
  app.use(cors(corsOptions))
  app.use(urlencoded({ extended: true }))

  // z: ------------- DATABASE ------------- //

  MONGO_DB.getInstance()
  checkOverload()

  // z: ------------- ROUTES ------------- //

  app.use("/", WELCOME)

  // TODO: Route version 1
  app.use("/v1/api/", ROUTER_V1)

  // z: ------------- HANDLING_ERROR ------------- //
  app.use(errorHandler())

  return app
}

export default START_SERVER
