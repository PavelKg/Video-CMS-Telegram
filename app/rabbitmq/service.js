'use strict'
const amqp = require('amqplib')
const {consume} = require('./helpers')
const config = require('../config')
const {messageHandler} = require('../telegram/botHandlers')
class RabbitmqService {
  constructor(amqpChannel, telebot) {
    this.telebot = telebot
    this.publishChannel = amqpChannel
    this.init()
  }

  init() {
    if (this.publishChannel) {
      this.runConsumer()
    }
  }

  async produce(queue, message, durable = true, persistent = false) {
    if (!this.publishChannel) {
      //await initPublishChannel() // no good
    }
    await this.publishChannel.assertQueue(queue, {durable})
    await this.publishChannel.sendToQueue(queue, Buffer.from(message), {
      persistent
    })
  }

  async subscribeToResponseQueue() {
    try {
      const consumeEmmitter = await consume({
        queue: config.responseQueue,
        durable: true
      })

      consumeEmmitter.on('data', async (message, ack) => {
        try {
          const {type, chatId, content} = JSON.parse(message)
          const {text, options = {}} = await messageHandler({
            queue: config.responseQueue,
            type,
            content
          })
          this.telebot.telegram.sendMessage(chatId, text, options)
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

  async runConsumer() {
    const intervalId = setInterval(() => {
      this.subscribeToResponseQueue().then((isConnected) => {
        if (isConnected) {
          clearInterval(intervalId)
          console.log('Rabbit consumer is up')
        }
      })
    }, config.rabbitReconnectInterval)
  }
}

module.exports = RabbitmqService
