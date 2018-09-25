const Parser = require('rss-parser')

const testData = require('../testData/news.json')

const fetchNews = () => new Promise((resolve) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    (async () => {
      const parser = new Parser()
      const feed = await parser.parseURL(process.env.NEWS_FEED)

      const items = await feed.items.map(item => ({
        title: item.title,
        pubDate: item.pubDate,
        guid: item.guid,
        description: item.contentSnippet,
      }))

      resolve(items)
    })()
  }
})

module.exports = fetchNews
