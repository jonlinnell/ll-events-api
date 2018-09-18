#!/usr/bin/env node
const express = require('express')
const bodyParser = require('body-parser')

const { loadEvents } = require('./lib/events')

require('dotenv').config()

const app = express()

app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.get('/events', (req, res) => {
  loadEvents()
    .then(data => res.send(data))
})

app.listen(port, () => console.log(`Listening on port ${port}`)) /* eslint-disable-line no-console */
