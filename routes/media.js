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
  app.post(`${PREFIX}/add`, (req, res) => {
    addMedia(req)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.get(`${PREFIX}/active`, (req, res) => {
    getActiveMediaMetadata()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.get(`${PREFIX}/prunefiles`, (req, res) => {
    pruneMediaFiles()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.get(`${PREFIX}/:id`, (req, res) => {
    getMedia(req.params.id)
      .then(data => res.send(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.get(`${PREFIX}/thumbnail/:id`, (req, res) => {
    getMedia(req.params.id, true)
      .then(data => res.send(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.get(`${PREFIX}/metadata/:id`, (req, res) => {
    getMediaMetadataById(req.params.id)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.delete(`${PREFIX}/:id`, (req, res) => {
    deleteMediaById(req.params.id)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })

  app.put(`${PREFIX}/:id`, (req, res) => {
    updateMediaById(req.params.id, req.body)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Error: ${error}`))
  })
}

module.exports = routes
