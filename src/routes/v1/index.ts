import express from "express"
import { OK } from "~/core/success.response"
import { apiKey, permission } from "~/auth/checkAuth"

// Entities
import access from "~/routes/v1/access"
import email from "~/routes/v1/email"
import user from "~/routes/v1/user"
import product from "~/routes/v1/product"
import discount from "~/routes/v1/discount"
import cart from "~/routes/v1/cart"
import comment from "~/routes/v1/comment"
import upload from "~/routes/v1/upload"
import rbac from "~/routes/v1/rbac"
import profile from "~/routes/v1/profile"
import checkout from "~/routes/v1/checkout"
import inventory from "~/routes/v1/inventory"
import { push2LogDiscord } from "~/middleware/discord-log.middleware"
const router = express.Router()

/**
 * @openapi
 * /v1/api/health-check:
 *  get:
 *     tags:
 *     - API
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/health-check", (_, res) => {
  new OK({
    message: "Welcome ROUTE V1 !!!",
    metadata: {
      cheatCode: "HaHaHaHa !!!"
    }
  }).send(res)
})

router.use(push2LogDiscord)

// Comment apiKey n permission middleware  when u want to test email service
router.use(apiKey)
router.use(permission("0000"))

router.use("/auth", access)
router.use("/email", email)
router.use("/user", user)
router.use("/products", product)
router.use("/discounts", discount)
router.use("/checkout", checkout)
router.use("/inventory", inventory)
router.use("/cart", cart)
router.use("/comment", comment)
router.use("/upload", upload)
router.use("/rbac", rbac)
router.use("/profile", profile)

export default router
