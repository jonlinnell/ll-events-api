const router = require('express').Router()

const {
  addMedia,
  deleteMediaById,
  getActiveMediaMetadata,
  getMedia,
  getMediaData,
  getMediaMetadataById,
  updateMediaById,
} = require('../lib/media')

const { pruneMediaFiles } = require('../lib/mediaFiles')

router.post('/', (req, res) => {
  addMedia(req)
    .then(data => res.json(data))
    .catch(error => res.status(500).send(error.message))
})

router.get('/', (req, res) => {
  const { skip, limit } = req.query

  getMedia({
    skip,
    limit,
  })
    .then(media => res.json(media))
    .catch(error => res.status(500).send(error.message))
})

router.get('/active', (req, res) => {
  getActiveMediaMetadata()
    .then(data => res.json(data))
    .catch(error => res.status(500).send(error.message))
})

router.get('/prunefiles', (req, res) => {
  pruneMediaFiles()
    .then(data => res.json(data))
    .catch(error => res.status(500).send(error.message))
})

router.get('/:id', (req, res) => {
  getMediaData(req.params.id)
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error.message))
})

router.put('/:id', (req, res) => {
  updateMediaById(req.params.id, req.body)
    .then(data => res.json(data))
    .catch(error => res.status(500).send(error.message))
})

router.get('/thumbnail/:id', (req, res) => {
  getMediaData(req.params.id, true)
    .then(data => res.send(data))
    .catch(error => res.status(500).send(error.message))
})

router.get('/metadata/:id', (req, res) => {
  getMediaMetadataById(req.params.id)
    .then(data => res.json(data))
    .catch(error => res.status(500).send(error.message))
})

router.delete('/:idString', (req, res) => {
  const { idString } = req.params

  if (!idString || typeof idString !== 'string') res.status(400).send('No IDs specified.')

  if (/,/.test(idString)) {
    const ids = idString.split(',')

    const deletionTasks = ids.map(id => deleteMediaById(id))

    Promise.all(deletionTasks)
      .then(result => res.json(result))
      .catch(error => res.status(500).send(error.message))
  } else {
    deleteMediaById(idString)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  }
})

module.exports = router
