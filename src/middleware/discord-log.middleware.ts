import { Client, Colors, GatewayIntentBits, TextChannel } from "discord.js"
import { RequestHandler } from "express"

class LoggerService {
  private client: Client
  private channelId: string

  constructor() {
    this.channelId = process.env.DISCORD_CHANNEL_ID || ""
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.client.login(process.env.DISCORD_TOKEN)

    this.client.on("ready", () => {
      if (!this.client.user) return

      console.log(`Logged in as ${this.client.user.tag}`)
    })
  }

  async sendFormatLog(logData: { title: string; code: unknown; message: string }) {
    const { title, code, message } = logData
    const formattedLog = {
      content: message,
      embeds: [
        {
          color: Colors.Aqua,
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```"
        }
      ]
    }

    await this.sendLog(formattedLog)
  }

  async sendLog(log: any) {
    if (!this.client.user) return

    const channel = this.client.channels.cache.get(this.channelId) as TextChannel

    if (!channel) {
      console.log("Channel not found")
      return
    }

    await channel
      .send(log)
      .then(() => {
        channel.send("--------------------------------------------------")
      })
      .catch(console.error)
  }
}

const DiscordLogger = new LoggerService()

export const push2LogDiscord: RequestHandler = async (req, _, next) => {
  try {
    DiscordLogger.sendFormatLog({
      title: `${req.method.toUpperCase()} ${req.url}`,
      code: {
        requestId: req.requestId,
        query: req.query,
        body: req.body
      },
      message: `${req.get("host")} ${req.originalUrl}`
    }).then(() => {
      console.log("Send Msg To Discord Success!")
    })

    return next()
  } catch (error) {
    next(error)
  }
}
