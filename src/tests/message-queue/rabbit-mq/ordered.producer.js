const amqplib = require("amqplib")
const message = "New Product: Áo mới cà mau"

const runProducer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost")
        const channel = await connection.createChannel()

        const queueName = "ordered-queue-message"
        await channel.assertQueue(queueName, {
            durable: true
        })

        for (let i = 0; i < 10; i++) {
            const msg = `ordered-queue-message:::[${i}]`
            console.log(msg)
            channel.sendToQueue(queueName, Buffer.from(msg), {
                persistent: true
            })
        }

        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500)
    } catch (error) {
        console.log(error)
    }
}

runProducer().catch(console.error)
