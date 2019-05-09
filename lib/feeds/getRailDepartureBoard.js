const NationalRailDarwin = require('national-rail-darwin')

const testData = require('./offlineData/rail')
const stations = require('./data/railStations')

const rail = new NationalRailDarwin(process.env.DARWIN_TOKEN)

const getStationByCRS = crs => stations.find(a => a.crs === crs.toUpperCase())

const getRailDepartureBoard = ({ station, destination }) => new Promise((resolve, reject) => {
  if (process.env.USE_TEST_DATA) {
    resolve({
      station: getStationByCRS(station),
      destination: destination ? getStationByCRS(destination) : {},
      trainServices: testData,
    })
  } else {
    rail.getDepartureBoard(station, { destination }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          station: getStationByCRS(station),
          destination: destination ? getStationByCRS(destination) : {},
          trainServices: response.trainServices,
        })
      }
    })
  }
})

module.exports = getRailDepartureBoard
