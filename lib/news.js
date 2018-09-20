const Parser = require('rss-parser')

const fetchNews = () => new Promise((resolve) => {
  (async () => {
    const parser = new Parser()
    const feed = await parser.parseURL('http://www.lborolondon.ac.uk/rss/news.xml')

    const items = await feed.items.map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      description: item.contentSnippet,
    }))

    resolve(items)
  })()
})

module.exports = fetchNews
