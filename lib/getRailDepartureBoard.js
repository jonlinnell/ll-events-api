const NationalRailDarwin = require('national-rail-darwin')

const testData = require('../testData/rail')

const rail = new NationalRailDarwin(process.env.DARWIN_TOKEN)

const getRailDepartureBoard = ({ station, destination }) => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    resolve(testData)
  } else {
    rail.getDepartureBoard(station, { destination }, (err, response) => (
      err
        ? reject(err)
        : resolve(response.trainServices)
    ))
  }
})

module.exports = getRailDepartureBoard
