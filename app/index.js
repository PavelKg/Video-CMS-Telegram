'use strict'
const fp = require('fastify-plugin')
const cors = require('fastify-cors')
const amqp = require('fastify-amqp')
const crypto = require('crypto')
const Telegraf = require('telegraf')
const config = require('./config')

const Telegram = require('./telegram')
const TelegramService = require('./telegram/service')

const RabbitService = require('./rabbitmq/service')

// secretpath generate
const current_date = new Date().valueOf().toString()
const random = Math.random().toString()
const secretpath = crypto
  .createHash('sha1')
  .update(current_date + random)
  .digest('hex')

async function initTelegramBot(fastify) {
  console.log('TeleBot init...')

  // Telegram bot
  const botSettings = config.botList[config.botName]
  const webHookPath = `https://${config.domen}/${secretpath}`

  const bot = new Telegraf(botSettings)
  bot.telegram.setWebhook(webHookPath)

  fastify.decorate(`telebot`, bot)
  console.log(`TeleBot ${config.botName} activated.`)
}

async function connectToAMQP(fastify) {
  console.log('AMQP Is Connecting...')
  const {AMQP_HOST, AMQP_USER, AMQP_PASS, AMQP_PORT} = process.env
  await fastify.register(amqp, {
    host: AMQP_HOST,
    port: AMQP_PORT,
    user: AMQP_USER,
    pass: AMQP_PASS
  })
  await fastify.after(function (err) {
    if (err) console.log('AMQP Is Connecting:', err)
    console.log('AMQP Is Ready.')
  })
}

async function decorateFastifyInstance(fastify) {
  console.log('Decorate Is Loading...')
  const amqpChannel = fastify.amqpChannel
  const telebot = fastify.telebot

  const rabbitService = new RabbitService(amqpChannel, telebot)
  const telegramService = new TelegramService(telebot, rabbitService)

  fastify.decorate('telegramService', telegramService)
  fastify.decorate('rabbitService', rabbitService)

  console.log('Decorate Loaded.')
}

module.exports = async function (fastify, opts) {
  fastify
    .register(fp(connectToAMQP))
    .register(fp(initTelegramBot))
    .register(fp(decorateFastifyInstance))
    .register(cors, {
      origin: /[\.kg|:8769|:8080]$/,
      path: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      exposedHeaders: 'Location,Date'
    })

    // APIs modules
    //.register(Rabbitmq)
    .register(Telegram, {prefix: `/${secretpath}`})
}
