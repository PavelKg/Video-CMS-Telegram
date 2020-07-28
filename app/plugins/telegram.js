'use strict'

const fp = require('fastify-plugin')

function fastifyWebHook(fastify, options, next) {
  const {
    url = '/webhook',
    handler = function (request, reply) {
      reply.type('application/json').send({statusCode: 200, result: 'success'})
    },
    disableWebhook = false,
    enableGetPlaceholder = false,
    secretKey = null,
    preHandlers: preHandlers = []
  } = options

  if (typeof handler !== 'function') {
    throw new TypeError(
      `The option webhook must be a function, instead got a '${typeof handler}'`
    )
  }

  console.log({handler})

  if (disableWebhook === false) {
    fastify.route({
      method: 'POST',
      url,
      preHandler: preHandlers,
      handler
    })
    // if (enableGetPlaceholder === true) {
    //   fastify.get(url, {}, (request, reply) => {
    //     reply
    //       .code(405)
    //       .send(
    //         new Error('Placeholder for a webhook, you need to call via POST')
    //       )
    //   })
    // }
  }

  next()
}
module.exports = fp(fastifyWebHook, {
  fastify: '^2.1.0',
  name: 'fastify-webhook'
})
