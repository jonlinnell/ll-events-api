#!/usr/bin/env node
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const app = express()

const { ALLOWED_ORIGINS } = process.env

app.use(bodyParser.json())
app.use(cors({
  origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : true,
}))

const port = process.env.PORT || 3000

require('./routes')(app)

if (process.env.USE_TEST_DATA) { console.log('Using test data. Unset USE_TEST_DATA to use live feeds.') }

app.listen(port, () => console.log(`Listening on port ${port}`)) /* eslint-disable-line no-console */
