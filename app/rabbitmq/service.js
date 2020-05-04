'use strict'
class RabbitmqService {
  constructor(amqpChannel) {
    // this.amqpChannel = amqpChannel
    // console.log('RabbitmqService1')
    // this.init()
  }
  async init() {
    // const telegram_to_vcms = 'telegram-to-vcms'
    // const vcms_to_telegram = 'vcms-to-telegram'
    // const amqpChannel = this.amqpChannel
    // console.log('RabbitmqService')
    // if (amqpChannel) {
    //   amqpChannel.assertQueue(telegram_to_vcms, {durable: true})
    //   amqpChannel.assertQueue(vcms_to_telegram, {durable: true})
    //   amqpChannel.consume(vcms_to_telegram, (msg) => {
    //     this.amqpConsumer(msg)
    //   })
    // }
  }
  async amqpConsumer(msg) {
    //console.log(fastify)
    //console.log(msg)
  }
}

module.exports = RabbitmqService
