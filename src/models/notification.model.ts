import { Schema, model } from "mongoose"

import { NOTI_TYPE_ENUM } from "~/constants/notification"
import { COLLECTION_NAME, DOCUMENT_NAME } from "~/constants/model"
import {
  TNotification,
  TNotificationModel,
  TRawNotification
} from "~/@types/model/notification.type"

const NotificationSchema = new Schema<TNotification, TNotificationModel>(
  {
    noti_title: {
      type: String,
      required: true
    },
    noti_message: {
      type: String,
      required: true
    },
    noti_type: {
      type: String,
      enum: NOTI_TYPE_ENUM,
      required: true
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME.SHOP,
      required: true
    },
    noti_receiverId: {
      type: Number,
      required: true
    },
    noti_options: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME.NOTIFICATIONS
  }
)

NotificationSchema.statics.build = (attrs: TRawNotification): Promise<TNotification> => {
  return NotificationModel.create(attrs)
}

const NotificationModel = model<TNotification, TNotificationModel>(
  DOCUMENT_NAME.NOTIFICATION,
  NotificationSchema
)

export default NotificationModel
