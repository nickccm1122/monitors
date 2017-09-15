'use strict'

const TelegramBot = require('node-telegram-bot-api')
const rootPath = require('pkg-dir').sync(__dirname)

const config = require(`${rootPath}/src/config`)

const options = {}
const telegramBot = new TelegramBot(config.telegram.token, options)

module.exports = {
  sendMessage: async ({ text = '' }) => {
    const chatIds = config.telegram.chatIds
    await Promise.all(
      chatIds.map(chatId => {
        return telegramBot.sendMessage(chatId, text)
      })
    )
  }
}
