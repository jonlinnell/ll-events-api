const axios = require('axios')

const MODES = [
  'tube',
  'overground',
  'dlr',
  'tflrail',
  'tram',
]

const fetchTubeStatus = () => new Promise((resolve, reject) => {
  axios.get(`https://api.tfl.gov.uk/line/mode/${MODES.join(',')}/status`, {
    params: {
      app_id: process.env.TFL_APP_ID,
      app_key: process.env.TFL_APP_KEY,
    },
  })
    .then(response => resolve(response.data))
    .catch(error => reject(error))
})

module.exports = fetchTubeStatus
