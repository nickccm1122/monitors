'use strict'

const moment = require('moment-timezone')
const cronParser = require('cron-parser')
const rootPath = require('pkg-dir').sync(__dirname)
const schedule = require('node-schedule')

const config = require(`${rootPath}/src/config`)
const logger = require(`${rootPath}/src/utils/logger`)
const notifier = require(`${rootPath}/src/services/notifier`)
const triplehGameCrawling = require(`${rootPath}/src/lamdas/triplehGameCrawling`)

const triplehGameCron = {
  start: () => {
    const cronName = 'triplehCrawling'
    const cronExpression = '* */3 * * * *'

    const interval = cronParser.parseExpression(cronExpression)
    logger.info(`Next ${cronName} will be performed at ${interval.next().toString()}`)

    const job = schedule.scheduleJob({
      end: moment.tz('2017-09-24', config.momentTimeZone),
      rule: cronExpression
    }, async () => {
      try {
        const rankings = await triplehGameCrawling()

        if (!rankings) {
          await notifier.sendMessage(`RankingPage is not working!!!`)
        }

        logger.info(`Next ${cronName} will be performed at ${job.nextInvocation()}`)
      } catch (e) {
        logger.error(e)
      }
    })
  }
}

module.exports = triplehGameCron
