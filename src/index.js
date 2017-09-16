'use strict'

const Koa = require('koa')
const rootPath = require('pkg-dir').sync(__dirname)

const config = require(`${rootPath}/src/config`)
const logger = require(`${rootPath}/src/utils/logger`)
const { triplehGameCron } = require(`${rootPath}/src/crons`)

const app = new Koa()

app.listen(config.port, () => {
  logger.info('Server started..')

  triplehGameCron.start()
})

process.on('unhandledRejection', error => {
  logger.error('unhandledRejection', error.stack)
})

process.on('SIGTERM', () => {
  triplehGameCron.stop()
})
