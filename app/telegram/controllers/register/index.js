const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const config = require('../../../config')
const {isEmail} = require('../../../consts')

// Register
const registerScene = new Scene('register')

registerScene.enter((ctx) => ctx.replyWithMarkdown(ctx.i18n.t('scenes.register.requestEmail')))

registerScene.command('quit', (ctx) => {
  ctx.scene.leave()
})
registerScene.leave((ctx) => ctx.reply(ctx.i18n.t('shared.help')))
registerScene.on('text', async (ctx) => {
  if (!isEmail(ctx.message.text)) {
    return ctx.replyWithMarkdown(ctx.i18n.t('scenes.register.requestEmail'))
  }
  const email = ctx.message.text
  const {first_name = '', last_name = '', username = '', id: chatId} = ctx.from

  const message = {
    type: 'messenger_registr',
    chatId,
    content: {first_name, last_name, username, email}
  }
  ctx.rabbit.produce(config.produceQueue, JSON.stringify(message))

  await ctx.reply(ctx.i18n.t('scenes.register.info'))
  return ctx.scene.leave()
})
registerScene.on('message', (ctx) =>
  ctx.replyWithMarkdown(ctx.i18n.t('scenes.register.requestEmail'))
)

module.exports = {registerScene}
