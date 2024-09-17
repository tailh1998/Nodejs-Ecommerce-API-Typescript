import { RequestHandler } from "express"
import { HEADER } from "~/constants"
import { v4 as uuidV4 } from "uuid"
import LoggerV2 from "~/utils/logger.v2"

const logRequestId: RequestHandler = (req, _, next) => {
  const requestId = req.headers?.[HEADER.REQUEST_ID] || uuidV4()

  req.requestId = requestId as string
  LoggerV2.log(`${req.method}::::input params`, [
    req.path,
    { requestId },
    {
      body: req.body,
      query: req.query
    }
  ])
  next()
}

export default logRequestId
