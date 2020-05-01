const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const fastifyApp = require('fastify')()

console.log(process.env)

require('dotenv').config()
const {
  PORT = 8443,
  BOTS,
  DOMEN = 'binas79.synology.me:8443',
  AMQP_HOST,
  AMQP_PORT,
  AMQP_USER,
  AMQP_PASS,
  NODE_ENV
} = process.env

fastifyApp
  .register(require('fastify-amqp'), {
    host: AMQP_HOST,
    port: AMQP_PORT,
    user: AMQP_USER,
    pass: AMQP_PASS
  })
  .after(function (err) {
    if (err) throw err
    //   // if (!fastifyApp.hasDecorator('amqpConn') || !fastifyApp.hasDecorator('amqpChannel')) {
    //   //   throw new Error('Undefined error with connection.')
    //   // }
    //fastifyApp.amqpChannel.assertQueue('hello')
    const channel = fastifyApp.amqpChannel
    channel.assertQueue('hello')
    //if (ok) {
    // start consuming queue
    channel.consume('hello', (msg) => {
      console.log(msg.content.toString())
      channel.ack(msg)
    })
    //}
  })
const bots = JSON.parse(BOTS)
const bot = new Telegraf(bots['vcmstestbot'])

const keyboard = Markup.inlineKeyboard([
  Markup.loginButton('Login', 'kdsjfgjdksf'),
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
])

bot.start((ctx) => {
  console.log(ctx.message)
  ctx.reply('Hello', Extra.markup(keyboard))
})
bot.help((ctx) => ctx.reply('Help zone'))

bot.action('swap_media', (ctx) =>
  ctx.replyWithPhoto({url: 'https://picsum.photos/200/300/?random'})
)

bot.on(['text', 'sticker', 'photo'], (ctx) => {
  console.dir(ctx.from)
  const {username, first_name} = ctx.from
  const name = username ? username : first_name

  const channel = fastifyApp.amqpChannel

  const queue = 'hello'
  const msg = 'Hello world'

  channel.assertQueue(queue, {
    //durable: false
  })

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(ctx.message)))

  //reply.send(' [x] Sent ' + msg)
  //ctx.replyWithPhoto({url: 'https://picsum.photos/200/300/?random'})
  ctx.reply(`Hello ${name} !!!`)
  //   ctx.replyWithPhoto(
  //     'https://picsum.photos/200/300/?random',
  //     Extra.caption('Caption *text*').markdown()
  //   )
  //   ctx.replyWithAnimation(
  //     'https://media.giphy.com/media/ya4eevXU490Iw/giphy.gif',
  //     Extra.markup((m) =>
  //       m.inlineKeyboard([m.callbackButton('Change media', 'swap_media')])
  //     )
  //  )
  ctx.telegram.sendMessage('304230716', ctx.message.text)
})

fastifyApp.use(bot.webhookCallback('/secretpath'))
console.log(`https://${DOMEN}/secretpath`)

bot.telegram.setWebhook(`https://${DOMEN}/secretpath`)

fastifyApp.listen(PORT, '0.0.0.0', () => {
  console.log(`Example app listening on port ${PORT}!`)
})
