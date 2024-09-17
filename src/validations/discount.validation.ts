import { RequestHandler } from "express"
import { UnprocessableEntityError } from "~/core/error.response"

export const validateDateCreateDiscount: RequestHandler = async (req, _, next) => {
  const { start_date, end_date } = req.body
  if (new Date() < new Date(start_date) && new Date() > new Date(end_date)) {
    next(new UnprocessableEntityError("Invalid start or end date!"))
  } else if (new Date(start_date) > new Date(end_date)) {
    next(new UnprocessableEntityError("Start date must be before end date!"))
  } else {
    next()
  }
}

export const validateDateUseDiscount: RequestHandler = async (req, _, next) => {
  const { start_date, end_date } = req.body

  if (new Date() < new Date(start_date)) {
    next(new UnprocessableEntityError("Discount has not started yet!"))
  } else if (new Date() > new Date(end_date)) {
    next(new UnprocessableEntityError("Discount has expired!"))
  } else {
    next()
  }
}
