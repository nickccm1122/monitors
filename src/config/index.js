'use strict'

const rootPath = require('pkg-dir').sync(__dirname)
const credentials = require(`${rootPath}/src/config/credentials`)

const env = process.env.NODE_ENV || 'development'

const config = {
  default: {
    momentTimeZone: 'Asia/Hong_Kong',
    port: 9001
  },
  development: {}
}

module.exports = Object.assign({}, config.default, config[env], credentials)
