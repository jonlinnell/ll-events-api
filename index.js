#!/usr/bin/env node

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const https = require('https')
const fs = require('fs')
const { resolve } = require('path')

const { media, settings } = require('./models')

/* CONFIG DEFINITIONS */

const app = express()

const {
  ALLOWED_ORIGINS,
  HTTPS_CERT,
  HTTPS_KEY,
} = process.env

const serverConfig = {
  key: fs.readFileSync(resolve(HTTPS_KEY), 'utf8'),
  cert: fs.readFileSync(resolve(HTTPS_CERT), 'utf8'),
}

const port = process.env.PORT || 3000

/* END CONFIG DEFINITIONS */

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileupload())
app.use(cors({
  origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : true,
}))

require('./routes/feeds')(app)
require('./routes/media')(app)
require('./routes/settings')(app)

/* Database functions */

media.sync()
  .catch((err) => { throw new Error(err) })

settings.sync()
  .catch((err) => { throw new Error(err) })

/* Start the server */

if (process.env.USE_TEST_DATA) { process.stdout.write('Using test data. Unset USE_TEST_DATA to use live feeds.\n') }

https.createServer(serverConfig, app).listen(port, () => process.stdout.write(`Listening on port ${port}\n`))
