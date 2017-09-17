'use strict'

const moment = require('moment-timezone')
const R = require('ramda')
const rootPath = require('pkg-dir').sync(__dirname)
const schedule = require('node-schedule')

const config = require(`${rootPath}/src/config`)
const logger = require(`${rootPath}/src/utils/logger`)
const notifier = require(`${rootPath}/src/services/notifier`)
const triplehGameCrawling = require(`${rootPath}/src/lamdas/triplehGameCrawling`)

const triplehGameCron = {
  start: () => {
    const job = schedule.scheduleJob({
      end: moment.tz('2017-09-24', config.momentTimeZone),
      rule: '*/15, * * * * *'
    }, async () => {
      try {
        const rankings = await triplehGameCrawling()

        if (!rankings) {
          await notifier.sendMessage(`RankingPage is not working!!!`)
        } else {
          await notifier.sendMessage(JSON.stringify(R.slice(0, 3, rankings), null, 2))
        }

        logger.info(`next crawling will be performed at ${job.nextInvocation()}`)
      } catch (e) {
        logger.error(e)
      }
    })
  }
}

module.exports = triplehGameCron
