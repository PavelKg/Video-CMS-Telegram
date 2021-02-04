'use strict'
/* global require */
// Require the framework
const fs = require('fs')
const https = {
  key: fs.readFileSync('ssl_keys/privkey.pem'),
  cert: fs.readFileSync('ssl_keys/fullchain.pem')
}
const add_opt = process.env.NODE_ENV === 'local' ? {https} : {}

const fastify = require('fastify')({
  logger: true,
  ignoreTrailingSlash: true,
  bodyLimit: 7291456,
  ...add_opt
})

const app = require('./app')
fastify.register(app)

// Start listening.
const startServer = async () => {
  try {
    await fastify.listen(process.env.PORT || 8443, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
startServer()
