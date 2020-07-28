module.exports = async function (fastify, opts) {
  // Route registration
  // fastify.<method>(<path>, <schema>, <handler>)
  // schema is used to validate the input and serialize the output

  // Unlogged APIs
  fastify.post('/', {}, messHandler)

  module.exports[Symbol.for('plugin-meta')] = {
    decorators: {
      fastify: ['TelegramService']
    }
  }
  async function messHandler(req, reply) {
    await this.telegramService.handleUpdate(req, reply)
    reply.code(200).send()
  }
}
