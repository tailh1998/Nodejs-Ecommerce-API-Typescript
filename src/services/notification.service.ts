import { NOTIFICATION_TYPE } from "~/constants/notification"
import { TNotificationAttrs } from "~/@types/model/notification.type"
import { createNotification, getNotifications } from "~/models/repositories/notification.repo"

export class NotificationService {
  static async pushNotification(noti: TNotificationAttrs) {
    let noti_title = ""
    let noti_message = ""

    // Push notification to receiver
    if (noti.noti_type === NOTIFICATION_TYPE.PRODUCT.NEW) {
      noti_title = "New product"
      noti_message = "@@@ added a new product: ###"
    } else if (noti.noti_type === NOTIFICATION_TYPE.PRODUCT.DISCOUNT) {
      noti_title = "Product discount"
      noti_message = "@@@ has a discount for product: ###"
    }
    console.log("create notification: ", { ...noti, noti_title, noti_message })

    const newNoti = await createNotification({
      ...noti,
      noti_title,
      noti_message
    })

    return newNoti
  }

  static async getNotifications(userId: string, type: string = "ALL") {
    return await getNotifications(userId, type === "ALL" ? undefined : type)
  }
}
