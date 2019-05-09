const cache = require('memory-cache')
const router = require('express').Router()

const { fetchEvents } = require('../lib/feeds/events')
const fetchUniNews = require('../lib/feeds/fetchUniNews')
const fetchTubeStatus = require('../lib/feeds/fetchTubeStatus')
const fetchHeadlines = require('../lib/feeds/fetchHeadlines')
const getBusDepartures = require('../lib/feeds/getBusDepartures')
const getRailDepartureBoard = require('../lib/feeds/getRailDepartureBoard')

const CACHE_PREFIX = 'vw'
const CACHE_EVENTS = `${CACHE_PREFIX}-events`
const CACHE_UNINEWS = `${CACHE_PREFIX}-uninews`
const CACHE_HEADLINES = `${CACHE_PREFIX}-headlines`
const CACHE_TUBE = `${CACHE_PREFIX}-tube`
const CACHE_BUS = `${CACHE_PREFIX}-bus`
const CACHE_TRAIN = `${CACHE_PREFIX}-train`

router.get('/events', (req, res) => {
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

router.get('/uniNews', (req, res) => {
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

router.get('/headlines', (req, res) => {
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

router.get('/tube', (req, res) => {
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

router.get('/bus/:stopCode/:limit?', (req, res) => {
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

router.get('/rail/:station/:destination?', (req, res) => {
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

module.exports = router
