import { NOTIFICATION_TYPE } from "~/constants/notification"
import { ValueOf } from ".."
import { HydratedDocument, Model, ObjectId } from "mongoose"

export type TRawNotification = {
  noti_title: string
  noti_message: string
  noti_type: ValueOf<{
    [K in keyof typeof NOTIFICATION_TYPE]: ValueOf<(typeof NOTIFICATION_TYPE)[K]>
  }>
  noti_senderId: ObjectId
  noti_receiverId: number
  noti_options: Object
}

export type TNotification = HydratedDocument<TRawNotification>

export type TNotificationAttrs = {
  noti_title?: TRawNotification["noti_title"]
  noti_message?: TRawNotification["noti_message"]
  noti_type: TRawNotification["noti_type"]
  noti_senderId: string | ObjectId
  noti_receiverId: number
  noti_options: TRawNotification["noti_options"]
}

export type TNotificationModel = Model<TNotification> & {
  build(attrs: TNotificationAttrs): Promise<TNotification>
}
