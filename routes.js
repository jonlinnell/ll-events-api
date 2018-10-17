const { fetchEvents } = require('./lib/events')
const fetchUniNews = require('./lib/fetchUniNews')
const fetchTubeStatus = require('./lib/fetchTubeStatus')
const fetchHeadlines = require('./lib/fetchHeadlines')
const getBusDepartures = require('./lib/getBusDepartures')
const getRailDepartureBoard = require('./lib/getRailDepartureBoard')
const get3x3content = require('./lib/get3x3content')

const routes = (app) => {
  app.get('/events', (req, res) => {
    fetchEvents()
      .then(data => res.send(data))
  })

  app.get('/uniNews', (req, res) => {
    fetchUniNews()
      .then(data => res.json(data))
  })

  app.get('/headlines', (req, res) => {
    fetchHeadlines()
      .then(data => res.json(data))
  })

  app.get('/tube', (req, res) => {
    fetchTubeStatus()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`An error occurred loading the tube data: ${error}`))
  })

  app.get('/bus/:stopCode/:limit?', (req, res) => {
    // const { stopCode, limit } = req.params

    if (!req.params.stopCode) res.status(400).send('No stop code provided.')

    getBusDepartures(req.params)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`An error occurred loading the bus data: ${error}`))
  })

  app.get('/rail/:station/:destination?', (req, res) => {
    // const { station, destination } = req.params

    if (!req.params.station) res.status(400).send('No station specified.')

    getRailDepartureBoard(req.params)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })

  app.get('/update3x3', (req, res) => {
    get3x3content()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })
}

module.exports = routes
