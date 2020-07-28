const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const logger = require('../../utils/logger')
const {match} = require('telegraf-i18n')
const settings = new Scene('settings')

const {
  languageSettingsAction,
  languageChangeAction,
  accountSummaryAction,
  closeAccountSummaryAction
} = require('./actions')

const {getMainKeyboard, getBackKeyboard} = require('../../utils/keyboards')
const {
  getMainKeyboard: getSettingsMainKeyboard,
  sendMessageToBeDeletedLater
} = require('./helpers')
const {deleteFromSession} = require('../../utils/session')
const {leave} = Stage

settings.enter(async (ctx) => {
  logger.debug(ctx, 'Enters settings scene')
  const {backKeyboard} = getBackKeyboard(ctx)

  deleteFromSession(ctx, 'settingsScene')
  await sendMessageToBeDeletedLater(
    ctx,
    ctx.i18n.t('scenes.settings.what_to_change'),
    getSettingsMainKeyboard(ctx)
  )
  await sendMessageToBeDeletedLater(
    ctx,
    ctx.i18n.t('scenes.settings.settings'),
    backKeyboard
  )
})

settings.leave(async (ctx) => {
  logger.debug(ctx, 'Leaves settings scene')
  const {mainKeyboard} = getMainKeyboard(ctx)
  await ctx.reply(ctx.i18n.t('shared.what_next'), mainKeyboard)
  deleteFromSession(ctx, 'settingsScene')
})

settings.command('saveme', leave())
settings.hears(match('keyboards.back_keyboard.back'), leave())

settings.action(/languageSettings/, languageSettingsAction)
settings.action(/languageChange/, languageChangeAction)
settings.action(/accountSummary/, accountSummaryAction)
settings.action(/closeAccountSummary/, closeAccountSummaryAction)

module.exports = settings
