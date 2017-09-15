'use strict'

const bunyan = require('bunyan')
const rootPath = require('pkg-dir').sync(__dirname)

const pkg = require(`${rootPath}/package`)

const logger = bunyan.createLogger({
  name: pkg.name,
  src: true,
  streams: [{
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    stream: process.stdout
  }]
})

module.exports = logger