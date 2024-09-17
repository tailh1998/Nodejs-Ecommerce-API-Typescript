import { TNotificationAttrs } from "~/@types/model/notification.type"
import NotificationModel from "../notification.model"

const createNotification = async (notification: TNotificationAttrs) => {
  return await NotificationModel.build(notification)
}

const getNotifications = async (_userId: string, type?: string) => {
  const filter = { noti_receiverId: 0, noti_type: type }
  if (!type || type === "ALL") {
    delete filter["noti_type"]
  }
  return await NotificationModel.find(filter, {
    createdAt: 0,
    updatedAt: 0,
    __v: 0
  })
}

export { createNotification, getNotifications }
