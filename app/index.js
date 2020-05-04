'use strict'
const cors = require('fastify-cors')
const fp = require('fastify-plugin')
const amqp = require('fastify-amqp')

async function connectToAMQP(fastify) {
  console.log('AMQP Is Connecting...')
  const {AMQP_HOST, AMQP_USER, AMQP_PASS, AMQP_PORT} = process.env
  await fastify.register(amqp, {
    host: AMQP_HOST,
    port: AMQP_PORT,
    user: AMQP_USER,
    pass: AMQP_PASS
  })
  await fastify.after(function (err) {
    if (err) console.log('AMQP Is Connecting:', err)
    console.log('AMQP Is Ready.')
  })
}

async function decorateFastifyInstance(fastify) {
  console.log('Decorate Is Loading...')
  const amqpChannel = fastify.amqpChannel

  console.log('Decorate Loaded.')
}

module.exports = async function (fastify, opts) {
  fastify
    .register(fp(connectToAMQP))
    .register(fp(decorateFastifyInstance))
    .register(cors, {
      origin: /[\.kg|:8769|:8080]$/,
      path: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      exposedHeaders: 'Location,Date'
    })

  // APIs modules
  //.register(Rabbitmq)
}
