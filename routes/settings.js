const {
  setSettings,
  getSettings,
} = require('../lib/settings')

const PREFIX = '/settings'

const routes = (app) => {
  app.post(`${PREFIX}`, (req, res) => {
    setSettings(req.body)
      .then(data => res.json(data))
      .catch(error => res.status(500).send(`Couldn't set new settings: ${error}`))
  })

  app.get(`${PREFIX}/:settings`, (req, res) => {
    getSettings(req.params.settings.split(','))
      .then(data => res.json(data))
      .catch(error => res.status(500).send(error))
  })
}

module.exports = routes
