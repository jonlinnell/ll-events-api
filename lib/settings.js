const { settings, Op } = require('../models')

const setSettings = newSettings => new Promise((resolve, reject) => settings
  .bulkCreate(Object.keys(newSettings).reduce((accumulator, key) => {
    accumulator.push({ key, value: newSettings[key] })

    return accumulator
  }, []), {
    updateOnDuplicate: ['value'],
  })
  .then(rows => resolve(rows))
  .catch(error => reject(error)))

const getSettings = requestSettings => new Promise((resolve, reject) => {
  settings.findAll({ attributes: ['key', 'value'], where: { key: { [Op.or]: requestSettings } } })
    .then((data) => {
      resolve(data.reduce((accumulator, setting) => {
        accumulator[setting.key] = setting.value

        return accumulator
      }, {}))
    })
    .catch(error => reject(error))
})

module.exports = {
  getSettings,
  setSettings,
}
