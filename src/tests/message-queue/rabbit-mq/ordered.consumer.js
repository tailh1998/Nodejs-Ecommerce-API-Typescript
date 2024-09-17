const amqplib = require("amqplib")
const message = "New Product: Áo mới cà mau"

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect("amqp://localhost")
        const channel = await connection.createChannel()

        const queueName = "ordered-queue-message"
        await channel.assertQueue(queueName, {
            durable: true,
        })

        // [order send noti] Set prefetch to 1 to ensure only one  ack at a time 
        channel.prefetch(1)

        channel.consume(queueName, msg => {
            const messageConsume = msg.content.toString();

            setTimeout(() => {
                console.log(`Processed::::[${messageConsume}]`)
                channel.ack(msg)
            }, Math.random() * 1000);
        })
    } catch (error) {
        console.log(error)
    }
}

runConsumer().catch(console.error)
