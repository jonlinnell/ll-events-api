const { getActiveMedia, addMedia } = require('../lib/media')

const PREFIX = '/media'

const routes = (app) => {
  app.get(`${PREFIX}/active`, (req, res) => {
    getActiveMedia()
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })

  app.post(`${PREFIX}/add`, (req, res) => {
    addMedia(req)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })
}

module.exports = routes
