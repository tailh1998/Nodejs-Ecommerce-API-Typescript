const amqplib = require("amqplib")
const message = "Hello, RabbitMQ for Tip Javascript"

const runConsumer = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost")
    const channel = await connection.createChannel()

    const queueName = "test-topic"
    await channel.assertQueue(queueName, {
      durable: true
    })

    // get messages from producer channel
    channel.consume(
      queueName,
      (message) => {
        console.log(`Received ${message.content.toString()}`)
      },
      {
        noAck: true
      }
    )
    console.log(`Message sent: ${message}`)
  } catch (error) {
    console.log(error)
  }
}

runConsumer().catch(console.error)
