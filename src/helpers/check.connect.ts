import mongoose from "mongoose"
import process from "process"
import os from "os"

const _SECOND = 5_000

export const countConnect = () => mongoose.connections.length

export const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect()
    const numCore = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // z: Example maximum number of connections based on number os cores
    const maxConnections = numCore * 5

    console.log(`Active Connection:::::: ${numConnection}`)
    console.log(`Memory Usage:::::: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`)

    if (numConnection > maxConnections) {
      console.warn("Connection overload detected!")
    }
  }, _SECOND) // * Monitor every 5 seconds
}
