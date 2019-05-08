const {
  addMedia,
  deleteMediaById,
  getActiveMediaMetadata,
  getMedia,
  getMediaMetadataById,
  pruneMediaFiles,
  updateMediaById,
} = require('../lib/media')

const PREFIX = '/media'

const routes = (app) => {
  app.post(`${PREFIX}`, (req, res) => {
    addMedia(req)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.get(`${PREFIX}/active`, (req, res) => {
    getActiveMediaMetadata()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.get(`${PREFIX}/prunefiles`, (req, res) => {
    pruneMediaFiles()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.get(`${PREFIX}/:id`, (req, res) => {
    getMedia(req.params.id)
      .then(data => res.send(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.get(`${PREFIX}/thumbnail/:id`, (req, res) => {
    getMedia(req.params.id, true)
      .then(data => res.send(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.get(`${PREFIX}/metadata/:id`, (req, res) => {
    getMediaMetadataById(req.params.id)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  })

  app.delete(`${PREFIX}/:idString`, (req, res) => {
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

  app.put(`${PREFIX}/:id`, (req, res) => {
    updateMediaById(req.params.id, req.body)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error.message))
  })
}

module.exports = routes
