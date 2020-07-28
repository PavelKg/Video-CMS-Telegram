const {Extra, Markup} = require('telegraf')
const {saveToSession} = require('../../utils/session')

const get = function (obj, item, defVal) {
  const items = item.split('.')
  const checkItem = items.shift()
  if (!obj.hasOwnProperty(checkItem)) {
    return defVal
  }
  if (items.length === 0) {
    return obj[checkItem] ? obj[checkItem] : defVal
  } else {
    return get(obj[checkItem], items.join('.'), defVal)
  }
}
/**
 * Returns main settings keyboard
 */
function getMainKeyboard(ctx) {
  return Extra.HTML().markup((m) => {
    return m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.settings.language_button'),
          JSON.stringify({a: 'languageSettings'}),
          false
        ),
        m.callbackButton(
          ctx.i18n.t('scenes.settings.account_summary_button'),
          JSON.stringify({a: 'accountSummary'}),
          false
        )
      ],
      {}
    )
  })
}

/**
 * Returns language keyboard
 */
const getLanguageKeyboard = function () {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          `English`,
          JSON.stringify({a: 'languageChange', p: 'en'}),
          false
        ),
        m.callbackButton(
          `Русский`,
          JSON.stringify({a: 'languageChange', p: 'ru'}),
          false
        )
      ],
      {}
    )
  )
}

/**
 * Returns account summary keyboard
 */
const getAccountSummaryKeyboard = function (ctx) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          ctx.i18n.t('scenes.settings.back_button'),
          JSON.stringify({a: 'closeAccountSummary'}),
          false
        )
      ],
      {}
    )
  )
}

/**
 * Send message and saving it to the session. Later it can be deleted.
 * Used to avoid messages duplication
 * @param ctx - telegram context
 * @param translationKey - translation key
 * @param extra - extra for the message, e.g. keyboard
 */
async function sendMessageToBeDeletedLater(ctx, translationKey, extra) {
  ctx.webhookReply = false
  const message = await ctx.reply(translationKey, extra)
  const messagesToDelete = get(
    ctx.session,
    'settingsScene.messagesToDelete',
    []
  )

  saveToSession(ctx, 'settingsScene', {
    messagesToDelete: [
      ...messagesToDelete,
      {
        chatId: message.chat.id,
        messageId: message.message_id
      }
    ]
  })
}

module.exports = {
  sendMessageToBeDeletedLater,
  getMainKeyboard,
  getAccountSummaryKeyboard,
  getLanguageKeyboard
}
