const Parser = require('rss-parser')
const cheerio = require('cheerio')
const axios = require('axios')
const moment = require('moment-timezone')

const TIMEZONE = 'Europe/London'

moment.tz(TIMEZONE)

const scrubInput = input => input
  .replace(/\n/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

const formatDate = ({ date, time }) => `${scrubInput(date)}, ${scrubInput(time)}`

const coerceDate = date => moment(date, 'D MMMM YYYY', TIMEZONE).format()

const loadEvents = () => new Promise((resolve) => {
  (async () => {
    const parser = new Parser()
    const feed = await parser.parseURL('http://www.lborolondon.ac.uk/rss/events.xml')

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
            coercedDate: coerceDate($('.event__date').text()),
            location: scrubInput($('.event__venue').text()),
          })
        })
        .catch(error => reject(error)),
    ))))
  })()
})

module.exports = {
  loadEvents,
  formatDate,
  scrubInput,
  coerceDate,
}
