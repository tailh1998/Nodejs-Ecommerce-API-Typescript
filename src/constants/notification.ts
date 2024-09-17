export const NOTIFICATION_TYPE = {
  ORDER: {
    SUCCESS: "ORDER-001",
    FAILED: "ORDER-002",
    CANCEL: "ORDER-003",
    DELIVER: "ORDER-004"
  },
  USER: {
    REGISTER: "USER-001",
    FORGOT_PASSWORD: "USER-002",
    RESET_PASSWORD: "USER-003",
    VERIFY_EMAIL: "USER-004",
    CHANGE_EMAIL: "USER-005",
    CHANGE_PASSWORD: "USER-006",
    CHANGE_PROFILE: "USER-007"
  },
  PROMOTION: {
    NEW: "PROMOTION-001",
    ABOUT_TO_EXPIRE: "PROMOTION-002",
    EXPIRED: "PROMOTION-003"
  },
  PRODUCT: {
    NEW: "PRODUCT-001",
    FLASH_SALE: "PRODUCT-002",
    DISCOUNT: "PRODUCT-003"
  }
} as const

export const NOTI_TYPE_ENUM = Object.keys(NOTIFICATION_TYPE).reduce(
  (prev, key) => [
    ...prev,
    ...Object.values(NOTIFICATION_TYPE[key as keyof typeof NOTIFICATION_TYPE])
  ],
  [] as string[]
)
