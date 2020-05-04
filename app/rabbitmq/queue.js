const amqp = require('amqplib')
const EventEmitter = require('events')

const config = require('../config')
let pubChannel = undefined

const initPubChannel = async () => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()
  pubChannel = channel
}

const checkPubChannel = () => {
  console.log(typeof pubChannel)
}

const produce = async (queue, message, durable = true, persistent = false) => {
  if (!pubChannel){
      await initPubChannel() // no good
  }

  await pubChannel.assertQueue(queue, {durable})
  await pubChannel.sendToQueue(queue, Buffer.from(message), {persistent})

  console.log('Message produced: ', queue, message)
}

const consume = async ({
  queue,
  isNoAck = false,
  durable = false,
  prefetch = null
}) => {
  console.log('Reload consume')
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

const publish = async (queue, message) => {
//   console.log({pubChannel})
//   amqpChannel.assertQueue('')
//   await pubChannel.sendToQueue(queue, Buffer.from(message))
//   console.log('Message published: ', message)
}

const subscribe = async (exchangeName, exchangeType) => {
  const connect = await amqp.connect(config.rabbitMqUrl)
  const channel = await connect.createChannel()

  await channel.assertExchange(exchangeName, exchangeType, {durable: false})
  const queue = await channel.assertQueue('', {exclusive: true})
  channel.bindQueue(queue.queue, exchangeName, '')
  const consumeEmitter = new EventEmitter()

  try {
    channel.consume(
      queue.queue,
      (message) => {
        if (message !== null) {
          consumeEmitter.emit('data', message.content.toString())
        } else {
          const error = new Error('NullMessageException')
          consumeEmitter.emit('error', error)
        }
      },
      {noAck: true}
    )
  } catch (error) {
    consumeEmitter.emit('error', error)
  }
  return consumeEmitter
}

module.exports = {
  produce,
  consume,
  publish,
  subscribe,
  initPubChannel,
  checkPubChannel
}
