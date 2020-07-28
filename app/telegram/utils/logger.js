const util = require('util')

/**
 * Adds user id and nickname if found. Also formats message to display complex objects
 * @param ctx - telegram context
 * @param msg  - message
 * @param data - object to log
 */
function prepareMessage(ctx, msg, ...data) {
  const formattedMessage = data.length ? util.format(msg, ...data) : msg

  if (ctx && ctx.from) {
    return `[${ctx.from.id}/${ctx.from.username}]: ${formattedMessage}`
  }

  return `: ${formattedMessage}`
}

//const {combine, timestamp, printf} = format
// const logFormat = printf((info) => {
//   return `[${info.timestamp}] [${info.level}]${info.message}`
// })

const logger = {
  debug(message) {
    console.log(message)
  },
  error(message) {
    console.log(message)
  }
}

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level')
}

const loggerWithCtx = {
  debug: (ctx, msg, ...data) => logger.debug(prepareMessage(ctx, msg, ...data)),
  error: (ctx, msg, ...data) => logger.error(prepareMessage(ctx, msg, ...data))
}

module.exports = loggerWithCtx
