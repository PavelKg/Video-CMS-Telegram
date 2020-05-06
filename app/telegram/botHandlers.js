const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const queue = require('../rabbitmq/queue')

const config = require('.././config')
const messages = require('./messages')

const start = async (ctx) => {
  const token = ctx.startPayload
  if (token === '') {
    return
  }
  try {
    const {
      first_name = '',
      last_name = '',
      username = '',
      id: chatId
    } = ctx.from

    const message = {
      type: 'deeplink',
      chatId,
      content: {first_name, last_name, username, token}
    }
    queue.produce(config.produceQueue, JSON.stringify(message))
    ctx.reply(messages.start_and_token)
  } catch (error) {
    console.error(error)
    ctx.reply('ERROR')
  }
}

const help = (ctx) => {
  console.log('recive help from telegram')
  queue.produce(
    config.produceQueue,
    JSON.stringify({user_id: 1, message: 'aaa'})
  )
  ctx.reply(messages.help)
}

const register = (ctx) => {
  console.log('register user stage')
  // queue.produce(
  //   config.produceQueue,
  //   JSON.stringify({user_id: 1, message: 'aaa'})
  // )
  ctx.reply(messages.register)
}

const messageHandler = async (payload) => {
  const {queue, type, content} = payload
  let result
  switch (type) {
    case 'welcome':
      result = messages.welcome(content)
      break

    default:
      break
  }
  return result
}

module.exports = {
  start,
  help,
  messageHandler,
  register
  //url,
  //selector,
  //stop
}
