import { REDIS_CONFIG } from "~/constants/redis"
import { reserveInventory } from "~/models/repositories/inventory.repo"
import { client } from "~/configs/redis.config"

const acquireLock = async (userId: string, productId: string, quantity: number) => {
  const lockKey = `${REDIS_CONFIG.LOCK_PREFIX}${productId}`

  for (let times = 0; times < REDIS_CONFIG.ORDER_RETRY_TIMES; times++) {
    const nxResult = await client.setNX(lockKey, "I am being used!")
    console.log("set nx result:::", nxResult)
    if (nxResult) {
      try {
        const reserve = await reserveInventory(userId, productId, quantity)
        console.log("reservation result::::", reserve)

        const exp = await client.pExpire(lockKey, REDIS_CONFIG.ORDER_LOCK_EXPIRED_TIME)
        console.log("set expired time:::", exp)

        return reserve ? lockKey : null
      } catch (err) {
        const exp = await client.pExpire(lockKey, REDIS_CONFIG.ORDER_LOCK_EXPIRED_TIME)
        console.log("set expired time:::", exp)

        throw err
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock: string) => await client.del(keyLock)

export { acquireLock, releaseLock }
