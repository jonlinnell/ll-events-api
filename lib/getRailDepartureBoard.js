const NationalRailDarwin = require('national-rail-darwin')

const rail = new NationalRailDarwin(process.env.DARWIN_TOKEN)

const getRailDepartureBoard = ({ station, destination }) => new Promise((resolve, reject) => {
  rail.getDepartureBoard(station, { destination }, (err, response) => (
    err
      ? reject(err)
      : resolve(response)
  ))
})

module.exports = getRailDepartureBoard
