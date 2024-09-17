import winston, { createLogger, format } from "winston"

import { v4 as uuidV4 } from "uuid"

class MyLogger {
  logger: winston.Logger

  constructor() {
    const formatPrint = format.printf((info) => {
      const { level, message, context, requestId, timestamp, metadata } = info
      return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
    })

    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "log/v2",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
          level: "info"
        }),
        new winston.transports.DailyRotateFile({
          dirname: "log/v2",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          zippedArchive: true,
          maxSize: "1m",
          maxFiles: "14d",
          format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), formatPrint),
          level: "error"
        })
      ]
    })
  }

  commonParams = (params: unknown) => {
    let context, req, metadata

    if (!Array.isArray(params)) {
      context = params
    } else {
      ;[context, req, metadata] = params
    }

    const requestId = req?.requestId || uuidV4()

    return {
      requestId,
      context,
      req,
      metadata
    }
  }

  log = (message: string, params?: unknown) => {
    const _params = this.commonParams(params)
    this.logger.info(message, _params)
  }

  error = (message: string, params?: unknown) => {
    const _params = this.commonParams(params)
    this.logger.error(message, _params)
  }
}

const LoggerV2 = new MyLogger()

export default LoggerV2
