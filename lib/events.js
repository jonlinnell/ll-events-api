const Parser = require('rss-parser')
const cheerio = require('cheerio')
const axios = require('axios')
const moment = require('moment-timezone')

const testData = require('../testData/events.json')

const TIMEZONE = 'Europe/London'

moment.tz(TIMEZONE)

const scrubInput = input => input
  .replace(/\n/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

const formatDate = ({ date, time }) => `${scrubInput(date)}, ${scrubInput(time)}`

const coerceDate = date => moment(date, 'D MMMM YYYY', TIMEZONE).format()

const fetchEvents = () => new Promise((resolve) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    (async () => {
      const parser = new Parser()
      const feed = await parser.parseURL(process.env.EVENTS_FEED)

      resolve(Promise.all(feed.items.map(item => new Promise(
        (resolveItem, reject) => axios.get(item.link)
          .then(({ data }) => {
            const $ = cheerio.load(data)

            resolveItem({
              title: item.title,
              displayDate: formatDate({
                date: $('.event__date').text(),
                time: $('.event__time').text(),
              }),
              url: item.guid,
              coercedDate: coerceDate($('.event__date').text()),
              location: scrubInput($('.event__venue').text()),
            })
          })
          .catch(error => reject(error)),
      ))))
    })()
  }
})

module.exports = {
  fetchEvents,
  formatDate,
  scrubInput,
  coerceDate,
}
