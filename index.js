const Parser = require('rss-parser')
const express = require('express')
require('dotenv').config()

const parser = new Parser()
const app = express()

const url = process.env.FEED_URL
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  parser.parseURL(url, (err, feed) => res.send(feed))
})

app.listen(port, () => console.log(`Listening on port ${port}`))
