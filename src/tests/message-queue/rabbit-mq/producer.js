const amqplib = require("amqplib")
const message = "New Product: Áo mới cà mau"

const runProducer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost")
    const channel = await connection.createChannel()

    const queueName = "test-topic"
    await channel.assertQueue(queueName, {
      durable: true
    })

    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log(`Message sent: ${message}`)
  } catch (error) {
    console.log(error)
  }
}

runProducer().catch(console.error)
