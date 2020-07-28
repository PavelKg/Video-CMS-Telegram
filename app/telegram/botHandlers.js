const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const config = require('.././config')
const messages = require('./messages')

const help = (ctx) => {
  // ctx.rabbit.produce(
  //   config.produceQueue,
  //   JSON.stringify({user_id: 1, message: 'help'})
  // )
  ctx.reply('https://www.youtube.com/watch?v=4NLfJqCnpHA')
  ctx.reply(
    'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F1200%2F1*mk1-6aYaf_Bes1E3Imhc0A.jpeg&imgrefurl=https%3A%2F%2Ftowardsdatascience.com%2F3-numpy-image-transformations-on-baby-yoda-c27c1409b411&tbnid=gOUAFhrbQ2nYQM&vet=12ahUKEwiW1tT51O3qAhXVBXcKHQi5CzkQMygAegUIARCkAQ..i&docid=OXvyXJop1qSGqM&w=1200&h=900&q=image&safe=active&ved=2ahUKEwiW1tT51O3qAhXVBXcKHQi5CzkQMygAegUIARCkAQ'
  )
}

const register = (ctx) => {
  ctx.rabbit.produce(
    config.produceQueue,
    JSON.stringify({user_id: 1, message: 'aaa'})
  )
  ctx.reply(messages.register)
}

const messageHandler = async (payload) => {
  const {type, content} = payload
  let result
  switch (type) {
    case 'welcome':
      result = messages.welcome(content)
      break

    default:
      break
  }
  return result
}

module.exports = {
  //start,
  help,
  messageHandler,
  register
  //url,
  //selector,
  //stop
}
