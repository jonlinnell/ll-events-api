#!/usr/bin/env node

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const mongoose = require('mongoose')

/* CONFIG DEFINITIONS */

const app = express()

const { ALLOWED_ORIGINS, DBURI } = process.env

const port = process.env.PORT || 3000

/* END CONFIG DEFINITIONS */

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileupload())
app.use(
  cors({
    origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : true,
  }),
)

require('./routes/feeds')(app)
require('./routes/media')(app)

/* Start the server */

mongoose.connect(DBURI, { useNewUrlParser: true }, (error) => {
  if (error) {
    throw new Error(error)
  } else {
    process.stdout.write('Connection to MongoDB established.\n')
  }
})

if (process.env.USE_TEST_DATA) {
  process.stdout.write('Using test data. Unset USE_TEST_DATA to use live feeds.\n')
}

app.listen(port, () => process.stdout.write(`Listening on port ${port}\n`))
