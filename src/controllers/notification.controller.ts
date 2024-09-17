import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
import { NotificationService } from "~/services/notification.service"

export class NotificationController {
  static getNotifications: RequestHandler = async (req, res) => {
    const data = await NotificationService.getNotifications(
      req.user.userId,
      req.query.type as string
    )

    new OK({
      message: "Get all notifications successfully!",
      metadata: {
        data
        // link: {
        //   self: { href: "/api/v1/notifications", method: "GET" }
        // }
      }
    }).send(res)
  }
}
