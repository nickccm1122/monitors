'use strict'

const CronJon = require('cron').CronJob
const rootPath = require('pkg-dir').sync(__dirname)
const puppeteer = require('puppeteer')
const R = require('ramda')

const config = require(`${rootPath}/src/config`)
const logger = require(`${rootPath}/src/utils/logger`)
const notifier = require(`${rootPath}/src/services/notifier`)

const isRankingShown = async () => {
  const siteUrl = R.pathOr(null, ['cron', 'triplehGameCron', 'site'], config)
  if (!siteUrl) throw new Error('tripleh game site url not found')

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(siteUrl, { waitUntil: 'networkidle' })

  const waitForRankingPromise = page.waitForSelector('.content .fadeIn')
  const timeoutRejectPromise = new Promise((resolve, reject) => {
    setTimeout(reject, 3000, 'timeout!')
  })

  try {
    const result = await Promise.race([waitForRankingPromise, timeoutRejectPromise])
  } catch (e) {
    browser.close()
    logger.error(e)
    return false
  }

  return true
  browser.close()
}

module.exports = new CronJon({
  cronTime: '* */15 * * * *', // every 15 mins
  onTick: async () => {
    try {
      const isRankingStillWorking = await isRankingShown()
      if (!isRankingStillWorking) await notifier.sendMessage(`Ranking is not working!!!`)
    } catch (e) {
      logger.error(e)
    }
  },
  start: false,
  timeZone: config.momentTimeZone
})
