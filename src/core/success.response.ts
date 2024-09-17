import { Response } from "express"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

export class SuccessResponse {
  message: string
  status: StatusCodes
  metadata: any
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {}
  }: {
    message?: string
    statusCode?: StatusCodes
    reasonStatusCode?: ReasonPhrases
    metadata: any
  }) {
    this.message = message || reasonStatusCode
    this.status = statusCode
    this.metadata = metadata
  }

  send(res: Response) {
    return res.status(this.status).json(this)
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }: { message?: string; metadata: any }) {
    super({ message, metadata })
  }
}

export class CREATED extends SuccessResponse {
  options?: any
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options = {}
  }: {
    message?: string
    statusCode?: StatusCodes
    reasonStatusCode?: ReasonPhrases
    metadata: any
    options?: any
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata
    })

    this.options = options ?? {}
  }
}
