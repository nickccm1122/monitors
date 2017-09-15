'use strict'

const TelegramBot = require('node-telegram-bot-api')
const rootPath = require('pkg-dir').sync(__dirname)

const config = require(`${rootPath}/src/config`)
const telegram = require('./telegram/')

class Notifier {
  constructor (channels) {
    this.channels = channels
  }

  sendMessage (text) {
    const allChannelsPromise = Object.keys(this.channels).map(async name => {
      return this.channels[name].sendMessage({ text })
    })
    return Promise.all(allChannelsPromise)
  }
}

module.exports = new Notifier({
  telegram
})
