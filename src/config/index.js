'use strict'

const rootPath = require('pkg-dir').sync(__dirname)
const credentials = require(`${rootPath}/src/config/credentials`)
const R = require('ramda')

const env = process.env.NODE_ENV || 'development'

const config = {
  default: {
    momentTimeZone: 'Asia/Hong_Kong',
    port: 9001
  },
  development: {
    cron: {
      triplehGameCron: {
        cronTime: '*/15 * * * * *', // every 15 mins
        browserOption: {
          headless: false,
          slowMo: 250
        }
      }
    }
  },
  production: {
    cron: {
      triplehGameCron: {
        cronTime: '*/15 * * * * *', // every 15 mins
        browserOption: {
          headless: true,
          slowMo: false
        }
      }
    }
  }
}

const combinedConfig = R.mergeDeepRight(config.default, config[env])
const withCredentials = R.mergeDeepRight(combinedConfig, credentials)

module.exports = withCredentials
