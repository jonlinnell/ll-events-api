const axios = require('axios')

const testData = require('../testData/bus.json')

const API = 'http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1'

const getBusDepartures = ({ stopCode, limit }) => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    const { stopName, buses } = testData
    resolve({
      stopName,
      buses: buses.slice(0, limit),
    })
  } else {
    axios.get(API, {
      params: {
        stopCode1: stopCode,
        ReturnList: 'EstimatedTime,LineID,DestinationName,StopPointName,TripID',
      },
    })
      .then((response) => {
        const parsedResponseData = JSON.parse(`[${response.data.replace(/]/g, '],').replace(/\],$/, ']').toString()}]`)

        const busData = parsedResponseData
          .slice(1)
          .sort((a, b) => {
            const x = a[5]
            const y = b[5]
            return ((x < y) ? -1 : ((x > y) ? 1 : 0)) // eslint-disable-line no-nested-ternary
          })

        resolve({
          stopName: busData[0][1] || 'No departures',
          buses: busData
            .map(bus => ({
              journeyId: bus[4],
              destination: bus[3],
              service: bus[2],
              eta: Math.round(((Math.abs(new Date(bus[5] - Date.now())) % 86400000) % 3600000) / 60000), // eslint-disable-line max-len
            }))
            .slice(0, limit),
        })
      })
      .catch(error => reject(error))
  }
})

module.exports = getBusDepartures
