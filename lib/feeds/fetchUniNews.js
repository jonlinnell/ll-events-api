const Parser = require('rss-parser')

const testData = require('./offlineData/uniNews.json')

const fetchUniNews = () => new Promise((resolve) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    (async () => {
      const parser = new Parser()
      const feed = await parser.parseURL(process.env.NEWS_FEED)

      const items = await feed.items.map(item => ({
        title: item.title,
        pubDate: item.pubDate,
        url: item.guid,
        description: item.contentSnippet,
      }))

      resolve(items)
    })()
  }
})

module.exports = fetchUniNews
