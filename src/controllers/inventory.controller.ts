import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { InventoryService } from "~/services/inventory.service"

export class InventoryController {
  static addStockToInventory: RequestHandler = async (req, res) => {
    const data = await InventoryService.addStockToInventory(req.body)

    new OK({
      message: "Add Stock To Inventory Success",
      metadata: { data }
    }).send(res)
  }
}
