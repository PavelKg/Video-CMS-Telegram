const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const start = new Scene('start')
const Users = require('../../utils/users')
const {getMainKeyboard} = require('../../utils/keyboards')

const {leave} = Stage
start.command('saveme', leave())

start.leave(async (ctx) => {
  const {mainKeyboard} = getMainKeyboard(ctx)
  await ctx.reply(ctx.i18n.t('shared.command_not found'))
})

start.enter(async (ctx) => {
  const uid = String(ctx.from.id)
  const token = ctx.startPayload // hash after command: /start "jsdhfjsjfks"
  const user = await Users.findById(uid)

  if (token !== '' && !user) {
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
      ctx.rabbit.produce(config.produceQueue, JSON.stringify(message))
      ctx.reply(messages.start_and_token)
    } catch (error) {
      console.error(error)
      ctx.reply('ERROR')
    }
  } else {
    if (user) {
      const {mainKeyboard} = getMainKeyboard(ctx)
      await ctx.reply(ctx.i18n.t('scenes.start.welcome_back'), mainKeyboard)
    } else {
      ctx.reply(
        ':)',
        Extra.markup((m) => m.removeKeyboard())
      )
      ctx.scene.leave()
    }
  }
})

module.exports = start
