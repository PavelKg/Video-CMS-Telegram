const {ContextMessageUpdate} = require('telegraf')
const {
  getMainKeyboard,
  getLanguageKeyboard,
  getAccountSummaryKeyboard,
  sendMessageToBeDeletedLater
} = require('./helpers')
const logger = require('../../utils/logger')
const User = require('../../utils/users')
const {updateLanguage} = require('../../utils/language')
const {getBackKeyboard} = require('../../utils/keyboards')
const {deleteFromSession} = require('../../utils/session')

const languageSettingsAction = async (ctx) =>
  await ctx.editMessageText(
    ctx.i18n.t('scenes.settings.pick_language'),
    getLanguageKeyboard()
  )

const languageChangeAction = async (ctx) => {
  const langData = JSON.parse(ctx.callbackQuery.data)
  await updateLanguage(ctx, langData.p)
  const {backKeyboard} = getBackKeyboard(ctx)

  for (const msg of ctx.session.settingsScene.messagesToDelete) {
    await ctx.telegram.deleteMessage(msg.chatId, msg.messageId)
  }
  deleteFromSession(ctx, 'settingsScene')
  await sendMessageToBeDeletedLater(
    ctx,
    ctx.i18n.t('scenes.settings.language_changed'),
    getMainKeyboard(ctx)
  )
  await sendMessageToBeDeletedLater(
    ctx,
    ctx.i18n.t('scenes.settings.what_to_change'),
    backKeyboard
  )
}

const accountSummaryAction = async (ctx) => {
  logger.debug(ctx, 'Checking account summary')
  //const user = await User.findById(ctx.from.id)
  const user = {username: ctx.from.username, _id: ctx.from.id}

  await ctx.editMessageText(
    ctx.i18n.t('scenes.settings.account_summary', {
      username: user.username,
      id: user._id,
      version: process.env.npm_package_version
    }),
    getAccountSummaryKeyboard(ctx)
  )
  await ctx.answerCbQuery()
}

const closeAccountSummaryAction = async (ctx) => {
  await ctx.editMessageText(
    ctx.i18n.t('scenes.settings.what_to_change'),
    getMainKeyboard(ctx)
  )
  await ctx.answerCbQuery()
}

module.exports = {
  languageSettingsAction,
  languageChangeAction,
  accountSummaryAction,
  closeAccountSummaryAction
}
