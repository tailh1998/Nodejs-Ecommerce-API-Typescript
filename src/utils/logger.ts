import winston from "winston"
const { format } = winston
/**
 * Please use @colors/colors/safe
 * black | red | green | yellow | blue | magenta | cyan | white | gray | grey
 */
const custom = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    http: 5
  },
  colors: {
    error: "red",
    warn: "orange",
    info: "blue bold",
    verbose: "blue",
    debug: "green bold",
    http: "cyan"
  }
}
const { NODE_ENV } = process.env

winston.addColors(custom.colors)
export const myFormat = format.printf(
  (info) => `[${info.timestamp}] [${info.level}] ${info.message}`
)

export const logger = winston.createLogger({
  levels: custom.levels,
  level: NODE_ENV === "production" ? "error" : "debug",
  format: format.combine(
    format.label({ label: "order-api errors" }),
    format.timestamp(),
    format.colorize({ colors: custom.colors }),
    format.json(),
    myFormat
  ),

  transports: [
    new winston.transports.File({ filename: "log/info.log", level: "debug" }),
    new winston.transports.File({ filename: "log/error.log", level: "error" }),
    new winston.transports.Console({
      level: NODE_ENV === "production" ? "error" : "debug"
    })
  ]
})
