const axios = require('axios')

const testData = require('../testData/tube.json')

const MODES = [
  'tube',
  'overground',
  'dlr',
  'tflrail',
]

const fetchTubeStatus = () => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    axios.get(`https://api.tfl.gov.uk/line/mode/${MODES.join(',')}/status`, {
      params: {
        app_id: process.env.TFL_APP_ID,
        app_key: process.env.TFL_APP_KEY,
      },
    })
      .then(response => resolve(response.data))
      .catch(error => reject(error))
  }
})

module.exports = fetchTubeStatus
