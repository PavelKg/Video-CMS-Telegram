const queue = require('../rabbitmq/queue')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const config = require('.././config')
const {isEmail} = require('../utils')
const messages = require('./messages')
// Handler factoriess

// Register
const registerScene = new Scene('register')
registerScene.enter((ctx) => ctx.replyWithMarkdown(messages.requestEmail))
registerScene.command('quit', (ctx) => {
  ctx.scene.leave()
})
registerScene.leave((ctx) => ctx.reply(messages.help))
registerScene.on('text', async (ctx) => {
  if (!isEmail(ctx.message.text)) {
    return ctx.replyWithMarkdown(messages.requestEmail)
  }
  const email = ctx.message.text
  const {first_name = '', last_name = '', username = '', id: chatId} = ctx.from

  const message = {
    type: 'messenger_registr',
    chatId,
    content: {first_name, last_name, username, email}
  }
  queue.produce(config.produceQueue, JSON.stringify(message))

  await ctx.reply(messages.register)
  return ctx.scene.leave()
})
registerScene.on('message', (ctx) =>
  ctx.replyWithMarkdown(messages.requestEmail)
)

module.exports = {registerScene}
