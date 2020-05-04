require('dotenv').config()

const {AMQP_HOST, AMQP_PORT, AMQP_USER, AMQP_PASS} = process.env
const rabbitMqUrl = `amqp://${AMQP_USER}:${AMQP_PASS}@${AMQP_HOST}:${AMQP_PORT}/`

module.exports = {
  botName: process.env.BOT_NAME,
  botList: JSON.parse(process.env.BOTS),
  domen: process.env.DOMEN,
  rabbitMqUrl,
  responseQueue: process.env.RESPONSE_QUEUE,
  produceQueue: process.env.PRODUCE_QUEUE,
  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL,
}
