import { RequestHandler } from "express"

import { OK } from "../core/success.response"
import { DiscountService } from "~/services/discount.service"
import { getReturnData, getReturnList } from "~/utils"
import { TRequestQuery } from "~/@types"

export class DiscountController {
  static createDiscount: RequestHandler = async (req, res) => {
    const discount = await DiscountService.createDiscount({
      shop: req.user.userId,
      payload: req.body
    })

    const result = getReturnData(discount, { without: ["__v"] })

    new OK({
      message: "Create new discount successfully!",
      metadata: {
        data: result,
        options: {}
        // link: {
        //   getAllDrafts: {
        //     href: "/api/v1/products/drafts?limit=50&skip=0",
        //     method: "GET"
        //   }
        // }
      }
    }).send(res)
  }

  static getAllDiscountCodes: RequestHandler = async (req, res) => {
    const { shopId, limit, page } = req.query as TRequestQuery
    const result = await DiscountService.getAllDiscountCodes({
      shopId,
      limit,
      page
    })

    new OK({
      message: "Get all discount codes of shop successfully!",
      metadata: {
        data: getReturnList(result)
        // link: {
        //   self: { href: '/api/v1/discounts?shopId=&limit=&page=', method: 'GET' },
        // },
      }
    }).send(res)
  }

  static getApplicableProducts: RequestHandler = async (req, res) => {
    const { limit, page } = req.query as TRequestQuery
    const { code } = req.params

    const result = await DiscountService.getAllApplicableProducts({
      code,
      limit,
      page
    })

    new OK({
      message: "Get all applicable products for discount code successfully!",
      metadata: {
        data: getReturnList(result)
        // options: {},
        // link: {
        //   self: { href: "/api/v1/discounts", method: "GET" }
        // }
      }
    }).send(res)
  }

  static useDiscount: RequestHandler = async (req, res) => {
    const payload = {
      code: req.params.code,
      userId: req.user.userId,
      orders: req.body.orders
    }
    const data = await DiscountService.useDiscount(payload)

    new OK({
      message: "Use discount successfully!",
      metadata: {
        data
        // link: {
        //   self: { href: '/api/v1/discounts?shopId=&limit=&page=', method: 'GET' },
        // },
      }
    }).send(res)
  }

  static deleteDiscount: RequestHandler = async (req, res) => {
    const payload = {
      code: req.params.code,
      shopId: req.user.userId
    }
    const data = await DiscountService.deleteDiscount(payload)

    new OK({
      message: "Delete discount successfully!",
      metadata: {
        data
        // link: {
        //   self: { href: '/api/v1/discounts/:code', method: 'DELETE' },
        // },
      }
    }).send(res)
  }

  static cancelDiscount: RequestHandler = async (req, res) => {
    const payload = {
      code: req.params.code,
      userId: req.user.userId
    }
    const data = await DiscountService.cancelDiscount(payload)

    new OK({
      message: "Cancel discount successfully!",
      metadata: { data }
    }).send(res)
  }
}
