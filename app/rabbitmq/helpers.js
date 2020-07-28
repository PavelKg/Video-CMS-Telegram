const amqp = require('amqplib')
const EventEmitter = require('events')
const config = require('../config')

const consume = async ({
  queue,
  isNoAck = false,
  durable = false,
  prefetch = null
}) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertQueue(queue, {durable})

  if (prefetch) {
    channel.prefetch(prefetch)
  }
  const consumeEmitter = new EventEmitter()
  try {
    channel.consume(
      queue,
      (message) => {
        if (message !== null) {
          consumeEmitter.emit('data', message.content.toString(), () =>
            channel.ack(message)
          )
        } else {
          const error = new Error('NullMessageException')
          consumeEmitter.emit('error', error)
        }
      },
      {noAck: isNoAck}
    )
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}



module.exports = {
  consume,
}
