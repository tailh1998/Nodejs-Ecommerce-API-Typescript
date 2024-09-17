const amqplib = require("amqplib")
const message = "New Product: Áo mới cà mau"

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost")
        const channel = await connection.createChannel()

        const notificationExchange = "notificationExchange"
        const notiQueue = "notificationQueueProcess"
        const notificationExchangeDLX = "notificationExchangeDLX"
        const notificationExchangeRoutingKeyDLX = 'notificationExchangeRoutingKeyDLX'

        // 1. Create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. Create Queue
        const queue = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationExchangeRoutingKeyDLX
        })

        // 3. Binding queue
        await channel.bindQueue(queue.queue, notificationExchange)

        // 4. Send message
        console.log("\n")
        console.log(`::::[PRODUCER]::::`)
        console.log(message)
        console.log(`::::::::::::::::::`)
        console.log("\n")

        await channel.sendToQueue(queue.queue, Buffer.from(message), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500)
    } catch (error) {
        console.log(error)
    }
}

runProducer().catch(console.error)
