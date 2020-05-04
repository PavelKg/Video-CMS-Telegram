'use strict'
/* global require */
// Read the .env file.
const crypto = require('crypto')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const config = require('./app/config')
const queue = require('./app/rabbitmq/queue')

const {start, help, messageHandler} = require('./app/telegram/botHandlers')

// secretpath generate
const current_date = new Date().valueOf().toString()
const random = Math.random().toString()
const secretpath = crypto
  .createHash('sha1')
  .update(current_date + random)
  .digest('hex')

// Require the framework
const fastify = require('fastify')({
  logger: true,
  ignoreTrailingSlash: true,
  bodyLimit: 7291456
})

// Register swagger.
//const swagger = require('./config/swagger')
//fastify.register(require('fastify-swagger'), swagger.options)

// Telegram bot
const bot = new Telegraf(config.botList[config.botName])

bot.telegram.setWebhook(`https://${config.domen}/${secretpath}`)
bot.telegram.setMyCommands([
  {command: 'videolist', description: 'Command Description'}
])
bot.start(start)
bot.help(help)

fastify.use(bot.webhookCallback(`/${secretpath}`))

//RabbitMQ
queue.initPubChannel()

const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('👍', 'like'),
  Markup.callbackButton('👎', 'dislike'),
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
]).extra()

const subscribeToResponseQueue = async () => {
  try {
    const consumeEmmitter = await queue.consume({
      queue: config.responseQueue,
      durable: true
    })

    consumeEmmitter.on('data', async (message, ack) => {
      console.log(message)
      try {
        const {type, chatId, content} = JSON.parse(message)
        const {
          text,
          options = {},
          inlineMessageKeyboard = ''
        } = await messageHandler({
          queue: config.responseQueue,
          type,
          content
        })
        bot.telegram.sendMessage(chatId, text, options)
        //console.log('message from rabbit: ', {type, chatId, content})
        ack()
      } catch (error) {
        console.log('error from rabbit:', error)
      }
    })
    consumeEmmitter.on('error', (error) => console.error(error))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const intervalId = setInterval(() => {
  subscribeToResponseQueue().then((isConnected) => {
    if (isConnected) {
      clearInterval(intervalId)
      console.log('Bot is up')
    }
  })
}, config.rabbitReconnectInterval)

// Register application as a normal plugin.
const app = require('./app')
fastify.register(app)

// Start listening.
const startServer = async () => {
  try {
    await fastify.listen(process.env.PORT || 8443, '0.0.0.0')
    //fastify.swagger()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
startServer()
