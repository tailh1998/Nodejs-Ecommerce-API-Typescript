import { createClient } from "redis"

const CONNECT_TIME_OUT = 10000

const client = createClient({
  url: process.env.REDIS_URI,
  socket: {
    connectTimeout: CONNECT_TIME_OUT
  }
})

class Redis {
  private static instance: Redis

  constructor() {
    this.connect()
  }

  connect() {
    let retries = 3 // z: Retries connection 3 times

    const connectWithRetry = async () => {
      try {
        await client.connect()
        console.log("Connected to Redis")
      } catch (err) {
        if (retries === 0) {
          console.error("Could not connect to Redis", err)
          return
        }
        retries -= 1
        console.log(`Retrying connection to Redis... (${retries} attempts left)`)
        setTimeout(connectWithRetry, CONNECT_TIME_OUT)
      }
    }

    connectWithRetry()
  }

  static async getInstance() {
    if (!this.instance) {
      this.instance = new Redis()
    }

    return this.instance
  }

  static async closeConnection() {
    if (client.isOpen) {
      await client.quit()
      console.log("Redis connection closed")
    }
  }
}

// @ts-ignore
client.on("ready", async () => {
  const { id, laddr, flags, totMem, user, cmd, resp } = await client.clientInfo()

  console.log(
    `Redis info->>>id: ${id}, user: ${user},  laddr: ${laddr}, totMem: ${
      (totMem || 0) / 1024
    }, resp: ${resp}, flags: ${flags}, cmd: ${cmd}`
  )
})

const handleCloseConnectionRedis = async () => {
  await Redis.closeConnection()
  process.exit(0)
}

// Listen for termination signals
process.on("SIGINT", handleCloseConnectionRedis) // Handle Ctrl+C
process.on("SIGTERM", handleCloseConnectionRedis) // Handle termination signal (e.g., from Docker)
process.on("exit", handleCloseConnectionRedis) // Handle exit event

export const redisInstance = Redis.getInstance()
export { client }
