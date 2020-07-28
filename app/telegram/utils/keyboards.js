const {Markup} = require('telegraf')

/**
 * Returns back keyboard and its buttons according to the language
 * @param ctx - telegram context
 */
const getBackKeyboard = (ctx) => {
  const backKeyboardBack = ctx.i18n.t('keyboards.back_keyboard.back')
  let backKeyboard = Markup.keyboard([backKeyboardBack])

  backKeyboard = backKeyboard.resize().extra()

  return {
    backKeyboard,
    backKeyboardBack
  }
}

const getMainKeyboard = (ctx) => {
  const mainKeyboardSettings = ctx.i18n.t('keyboards.main_keyboard.settings')
  const mainKeyboardContact = ctx.i18n.t('keyboards.main_keyboard.contact')
  let mainKeyboard = Markup.keyboard([
    [mainKeyboardSettings, mainKeyboardContact]
  ])
  mainKeyboard = mainKeyboard.resize().extra()

  return {
    mainKeyboard,
    mainKeyboardSettings,
    mainKeyboardContact
  }
}

module.exports = {getMainKeyboard, getBackKeyboard}
