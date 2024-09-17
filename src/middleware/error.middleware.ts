import { ErrorRequestHandler, RequestHandler, Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { ENVIRONMENT } from "~/constants"
import { logger } from "~/utils/logger"
import LoggerV2 from "~/utils/logger.v2"

type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<any>

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND)
}

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err
  _req.body.requestId = _req.requestId
  LoggerV2.error(err.message, [
    _req.path,
    {
      requestId: _req.requestId
    },
    {
      message: err.message
    }
  ])

  logger.error("::::::::::::::::::::::::::::::")
  logger.error(err?.stack?.split("\n", 5).join("\n"))
  logger.error("::::::::::::::::::::::::::::::")
  logger.error("")
  next(`${err?.status} ${err?.message}`)
}

const defaultErrorRequestHandler: ErrorRequestHandler = (_err, _req, res) => {
  const statusCode = _err.status || StatusCodes.INTERNAL_SERVER_ERROR
  _req.body.requestId = _req.requestId
  LoggerV2.error(`[DEFAULT]::${_err.message}`, [
    _req.path,
    {
      requestId: _req.requestId
    },
    {
      message: _err.message
    }
  ])

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: process.env.NODE_ENV === ENVIRONMENT.DEV ? _err.stack : null,
    message: _err.message || "Internal Server Error"
  })
}

export const asyncHandler = (fn: AsyncHandlerFunction) => {
  return (req: Request | any, res: Response, next: NextFunction) => fn(req, res, next)?.catch(next)
}

export default () => [unexpectedRequest, addErrorToRequestLog, defaultErrorRequestHandler]
