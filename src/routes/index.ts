import express from "express"
import swaggerDocs from "~/utils/swagger"
import { OK } from "~/core/success.response"

const router = express.Router()

/**
 * @openapi
 * /:
 *  get:
 *     tags:
 *     - API
 *     responses:
 *       200:
 *         description: HaHaHaHa
 */
router.get("/", (_, res) => {
  new OK({
    message: "Welcome !!!",
    metadata: {
      cheatCode: "HaHaHaHa !!!"
    }
  }).send(res)
})

swaggerDocs(router)

export default router
