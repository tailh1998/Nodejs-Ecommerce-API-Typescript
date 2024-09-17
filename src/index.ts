import "@babel/register"
import "@babel/runtime-corejs3/regenerator"
import "core-js/stable"
import "es6-promise/auto"
import "winston-daily-rotate-file"

import http from "http"
import START_SERVER from "~/app"
import { logger } from "~/utils/logger"
import { ENVIRONMENT } from "~/constants"

const app = START_SERVER(process.env.NODE_ENV || ENVIRONMENT.DEV)
const port = Number(process.env.PORT ?? 8017)
const hostname = process.env.HOST
const server = http.createServer(app)

server.listen(port, hostname, () => {
  logger.info("server up and running")
  logger.info(`at: http://${hostname}:${port}`)
  logger.info(`as ${process.env.NODE_ENV}`)
})

const onCloseSignal = () => {
  logger.warning?.("sigint received, shutting down")
  server.close(() => {
    logger.warning?.("server closed")
    process.exit()
  })
  setTimeout(() => process.exit(1), 3000).unref() // Force shutdown after 10s
}

process.on("SIGINT", onCloseSignal)
process.on("SIGTERM", onCloseSignal)
