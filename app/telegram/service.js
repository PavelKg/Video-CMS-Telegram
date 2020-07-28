'use strict'

//import TelegrafI18n, {match}  = require( 'telegraf-i18n')
const TelegrafI18n = require('telegraf-i18n')
const {match} = require('telegraf-i18n')
const path = require('path')
const logger = require('./utils/logger')
const Markup = require('telegraf/markup')

const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const asyncWrapper = require('./utils/error-handler')
const {getMainKeyboard} = require('./utils/keyboards')
const startScene = require('./controllers/start')
const settingsScene = require('./controllers/settings')
const contactScene = require('./controllers/contact')
const {registerScene} = require('./controllers/register')
const {help} = require('./botHandlers')

class TelegramService {
  constructor(bot, rabbit) {
    this.bot = bot
    this.bot.context.rabbit = rabbit
    this.init()
  }
  init() {
    const stage = new Stage([
      startScene,
      registerScene,
      settingsScene,
      contactScene
    ])
    const bot = this.bot

    const i18n = new TelegrafI18n({
      defaultLanguage: 'en',
      directory: path.resolve(__dirname, 'locales'),
      useSession: true,
      allowMissing: false,
      sessionName: 'session'
    })

    bot.use(session())
    bot.use(i18n.middleware())
    bot.use(stage.middleware())

    bot.telegram.setMyCommands([
      {command: 'videolist', description: 'Command Description'},
      {command: 'register', description: 'Command Description'}
    ])

    bot.start(asyncWrapper(async (ctx) => ctx.scene.enter('start')))
    bot.help(help)

    bot.hears(
      match('keyboards.main_keyboard.settings'),
      asyncWrapper(async (ctx) => await ctx.scene.enter('settings'))
    )

    bot.hears(
      match('keyboards.main_keyboard.contact'),
      asyncWrapper(async (ctx) => await ctx.scene.enter('contact'))
    )

    bot.hears(
      match('keyboards.back_keyboard.back'),
      asyncWrapper(async (ctx) => {
        // If this method was triggered, it means that bot was updated when user was not in the main menu..
        logger.debug(ctx, 'Return to the main menu with the back button')
        const {mainKeyboard} = getMainKeyboard(ctx)

        await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
      })
    )

    //const stage = new Stage([registerScene])
    //this.bot.use(stage.middleware())
    bot.command('register', (ctx) => ctx.scene.enter('register'))
    bot.on('message', (ctx) =>
      ctx.reply(ctx.i18n.t('shared.command_not_found'))
    )
  }
  async handleUpdate(req, reply) {
    const {body} = req
    this.bot.handleUpdate(body)
  }
}

module.exports = TelegramService
