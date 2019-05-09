const jwt = require('jsonwebtoken')

const verifyToken = token => jwt.verify(token, process.env.SECRET, (err, verifiedToken) => {
  if (err) {
    throw err
  }

  return verifiedToken
})

const signToken = (token) => {
  const tokenWithTimes = Object.assign({}, token, {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)),
  })

  const signedToken = jwt.sign(tokenWithTimes, process.env.SECRET)

  return signedToken
}

module.exports = { verifyToken, signToken }
