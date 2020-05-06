const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const keyboard = Markup.inlineKeyboard([
  Markup.callbackButton('🎥 Video list', 'videolist'),
  Markup.callbackButton('✍ Test', 'test'),
  Markup.urlButton('➡ VideoCms Site', 'https://videocms.pepex.kg'),
  Markup.callbackButton('🔍 Search', 'search')
]).extra()

const start_and_token = `Please wait. We are checking your information...`
const start = ''

const help = `
/start to Get Menu
/register to Registration`

const register = `
Thank you! 
Please check your email. 
We have sent the registation information.`

const requestEmail = `
Please enter your email for instruction or 
*/quit* for exit.`

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
  start_and_token,
  help,
  url,
  selector,
  stop,
  exists,
  notExists,
  fetchError,
  changeDetected,
  invalidUrl,
  welcome,
  register,
  requestEmail
}
