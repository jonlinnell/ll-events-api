const cache = require('memory-cache')

const { fetchEvents } = require('../lib/events')
const fetchUniNews = require('../lib/fetchUniNews')
const fetchTubeStatus = require('../lib/fetchTubeStatus')
const fetchHeadlines = require('../lib/fetchHeadlines')
const getBusDepartures = require('../lib/getBusDepartures')
const getRailDepartureBoard = require('../lib/getRailDepartureBoard')

const CACHE_PREFIX = 'vwb'
const CACHE_EVENTS = `${CACHE_PREFIX}-events`
const CACHE_UNINEWS = `${CACHE_PREFIX}-uninews`
const CACHE_HEADLINES = `${CACHE_PREFIX}-headlines`
const CACHE_TUBE = `${CACHE_PREFIX}-tube`
const CACHE_BUS = `${CACHE_PREFIX}-bus`
const CACHE_TRAIN = `${CACHE_PREFIX}-train`

const routes = (app) => {
  app.get('/events', (req, res) => {
    const cachedData = cache.get(CACHE_EVENTS)

    if (cachedData) {
      res.json(cachedData)
    } else {
      fetchEvents().then((data) => {
        cache.put(CACHE_EVENTS, data, 55 * 60 * 1000)
        res.json(data)
      })
    }
  })

  app.get('/uniNews', (req, res) => {
    const cachedData = cache.get(CACHE_UNINEWS)

    if (cachedData) {
      res.json(cachedData)
    } else {
      fetchUniNews().then((data) => {
        cache.put(CACHE_UNINEWS, data, 55 * 60 * 1000)
        res.json(data)
      })
    }
  })

  app.get('/headlines', (req, res) => {
    const cachedData = cache.get(CACHE_HEADLINES)

    if (cachedData) {
      res.json(cachedData)
    } else {
      fetchHeadlines().then((data) => {
        cache.put(CACHE_HEADLINES, data, 55 * 60 * 1000)
        res.json(data)
      })
    }
  })

  app.get('/tube', (req, res) => {
    const cachedData = cache.get(CACHE_TUBE)

    if (cachedData) {
      res.json(cachedData)
    } else {
      fetchTubeStatus()
        .then((data) => {
          cache.put(CACHE_TUBE, data, 2 * 60 * 1000)
          res.json(data)
        })
        .catch(error => res.status(500).send(`An error occurred loading the tube data: ${error}`))
    }
  })

  app.get('/bus/:stopCode/:limit?', (req, res) => {
    // const { stopCode, limit } = req.params

    if (!req.params.stopCode) res.status(400).send('No stop code provided.')

    const cacheRequestID = `${CACHE_BUS}-${req.params.stopCode}`
    const cachedData = cache.get(cacheRequestID)

    if (cachedData) {
      res.json(cachedData)
    } else {
      getBusDepartures(req.params)
        .then((data) => {
          cache.put(cacheRequestID, data, 1 * 60 * 1000)
          res.json(data)
        })
        .catch(error => res.status(500).send(`An error occurred loading the bus data: ${error}`))
    }
  })

  app.get('/rail/:station/:destination?', (req, res) => {
    // const { station, destination } = req.params

    if (!req.params.station) res.status(400).send('No station specified.')

    const cacheRequestID = `${CACHE_TRAIN}-${req.params.station}`
    const cachedData = cache.get(cacheRequestID)

    if (cachedData) {
      res.json(cachedData)
    } else {
      getRailDepartureBoard(req.params)
        .then((data) => {
          cache.put(cacheRequestID, data, 2 * 60 * 1000)
          res.json(data)
        })
        .catch(error => res.status(500).send(error))
    }
  })
}

module.exports = routes
