'use strict'

const CronJon = require('cron').CronJob
const rootPath = require('pkg-dir').sync(__dirname)
const puppeteer = require('puppeteer')
const R = require('ramda')

const config = require(`${rootPath}/src/config`)
const logger = require(`${rootPath}/src/utils/logger`)
const notifier = require(`${rootPath}/src/services/notifier`)

const getTopThree = async () => {
  const siteUrl = R.pathOr(null, ['cron', 'triplehGameCron', 'site'], config)
  if (!siteUrl) throw new Error('tripleh game site url not found')

  const browser = await puppeteer.launch(
    R.pathOr({}, ['cron', 'triplehGameCron', 'browserOption'], config)
  )
  const page = await browser.newPage()
  page.on('console', (...args) => logger.debug('PAGE LOG:', ...args))
  await page.goto(siteUrl, { waitUntil: 'networkidle' })

  try {
    // wait for ranking table to show up, reject if timeout
    const waitForRankingPromise = page.waitForSelector('.content.fadeIn')
    const timeoutRejectPromise = new Promise((resolve, reject) => {
      setTimeout(reject, 3000, 'timeout!')
    })
    await Promise.race([waitForRankingPromise, timeoutRejectPromise])

    const rankingItems = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('.ranking_item'))
      return divs.map(div => ({
        name: div.querySelector('.name').innerText,
        score: div.querySelector('.score').innerText
      }))
    })

    browser.close()
    return rankingItems
  } catch (e) {
    browser.close()
    logger.error(e)
    return false
  }
}

module.exports = new CronJon({
  cronTime: R.pathOr('*/15 * * * * *', ['cron', 'triplehGameCron', 'cronTime'], config),
  onTick: async () => {
    try {
      const rankings = await getTopThree()

      if (!rankings) {
        await notifier.sendMessage(`RankingPage is not working!!!`)
      } else {
        // await notifier.sendMessage(JSON.stringify(R.slice(0, 3, rankings), null, 2))
      }
    } catch (e) {
      logger.error(e)
    }
  },
  start: true,
  timeZone: config.momentTimeZone
})
