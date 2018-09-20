const Parser = require('rss-parser')

const fetchNews = () => new Promise((resolve) => {
  (async () => {
    const parser = new Parser()
    const feed = await parser.parseURL(process.env.NEWS_FEED)

    const items = await feed.items.map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      description: item.contentSnippet,
    }))

    resolve(items)
  })()
})

module.exports = fetchNews
