const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const keyboard = Markup.inlineKeyboard([
  Markup.loginButton('Login', 'kdsjfgjdksf'),
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
])

const markup = Markup.inlineKeyboard([
  Markup.gameButton('🎮 Play now!'),
  Markup.urlButton('Telegraf help', 'http://telegraf.js.org')
])

const queue = require('../rabbitmq/queue')
//const utils = require('../../common/utils')
//const qMessages = require('../../common/qMessages')

const config = require('.././config')
const messages = require('./messages')

const start = async (ctx) => {
  try {
    const chatId = ctx.from.id
    const firstName = ctx.from.first_name
    const lastName = ctx.from.last_name

    const message = '' // `${qMessages.notificationCreated}/${chatId}`
    //await queue.publish(config.notificationsChangesQueue, 'fanout', message)
    //ctx.reply(messages.start)
    ctx.reply(
      `Hello ${ctx.from.first_name}, would you like to know the love compatibility?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Love Calculate', 'LOVE_CALCULATE'),
        Markup.urlButton('❤️', 'http://telegraf.js.org'),
        Markup.callbackButton('Delete', 'delete'),
        //Markup.gameButton('🎮 Play now!'),
        Markup.urlButton('Telegraf help', 'http://telegraf.js.org')
      ]).extra()
    )
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

// const url = async ctx => {
//   try {
//     const chatId = ctx.from.id
//     if ( await isNotificationNotExists(chatId, ctx) ) {
//       return
//     }
//     const url = (ctx.update.message.text || '').split(' ')[1]

//     if (!utils.isUrl(url)) {
//       ctx.reply(messages.invalidUrl)
//       return
//     }
//     await Notification.findOneAndUpdate({chatId}, {$set: {url}})
//     const message = `${qMessages.urlChanged}/${chatId}`
//     await queue.publish(config.notificationsChangesQueue, 'fanout', message)
//     ctx.reply(messages.url)
//   } catch (error) {
//     console.error(error)
//     ctx.reply('ERROR')
//   }
// }

// const selector = async ctx => {
//   try {
//     const chatId = ctx.from.id
//     if ( await isNotificationNotExists(chatId, ctx) ) {
//       return
//     }
//     const selector = (ctx.update.message.text || '').split(' ')[1]
//     await Notification.findOneAndUpdate({chatId}, {$set: {selector}})
//     const message = `${qMessages.selectorChanged}/${chatId}`
//     await queue.publish(config.notificationsChangesQueue, 'fanout', message)
//     ctx.reply(messages.selector)
//   } catch (error) {
//     console.error(error)
//     ctx.reply('ERROR')
//   }
// }

// const stop = async ctx => {
//   try {
//     const chatId = ctx.from.id
//     if ( await isNotificationNotExists(chatId, ctx) ) {
//       return
//     }
//     await Notification.findOneAndDelete({chatId})
//     const message = `${qMessages.notificationRemoved}/${chatId}`
//     await queue.publish(config.notificationsChangesQueue, 'fanout', message)
//     ctx.reply(messages.stop)
//   } catch (error) {
//     console.error(error)
//     ctx.reply('ERROR')
//   }
// }

module.exports = {
  start,
  help,
  messageHandler
  //url,
  //selector,
  //stop
}
