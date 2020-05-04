const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton('🎥 Video list', 'videolist'),
  Markup.callbackButton('✍ Test', 'test'),
  Markup.urlButton('➡ VideoCms Site', 'https://videocms.pepex.kg'),
  Markup.callbackButton('🔍 Search', 'search')
]).extra()

const start = `
Welcome!
Please add url and query selector to start.
Send /help for info.
`

const help = `
/start to Registration
/login to send notification to the email
/videolist to get video-list`

const url = `
URL configured.
`

const selector = `
Selector changed.
`

const stop = `
Notification removed.
`

const exists = `
Notification already exists.
`

const notExists = `
Notification not exists, run /start
`

const fetchError = `
Selected url can't be fetched!
`

const changeDetected = `
Change in selected contend detected!
`

const invalidUrl = `
Please, enter valid url
`
const welcome = (payload) => {
  try {
    const {first_name} = payload
    console.log(first_name)
    return {
      text: `Welcome ${first_name} !!!`,
      options: keyboard //{parse_mode: 'Markdown'},
    }
  } catch (err) {}
}

module.exports = {
  start,
  help,
  url,
  selector,
  stop,
  exists,
  notExists,
  fetchError,
  changeDetected,
  invalidUrl,
  welcome
}
