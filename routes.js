const { fetchEvents } = require('./lib/events')
const fetchNews = require('./lib/news')
const getBusDepartures = require('./lib/getBusDepartures')
const getRailDepartureBoard = require('./lib/getRailDepartureBoard')

const routes = (app) => {
  app.get('/events', (req, res) => {
    fetchEvents()
      .then(data => res.send(data))
  })

  app.get('/news', (req, res) => {
    fetchNews()
      .then(data => res.json(data))
  })

  app.get('/bus/:stopCode', (req, res) => {
    const { stopCode } = req.params

    if (!stopCode) res.status(400).send('No stop code provided.')

    getBusDepartures(stopCode)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`An error occurred loading the bus data: ${error}`))
  })

  app.get('/rail/:station/:destination?', (req, res) => {
    const { station, destination } = req.params

    getRailDepartureBoard({
      station,
      destination,
    })
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })
}

module.exports = routes
