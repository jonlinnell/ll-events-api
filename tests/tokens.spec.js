const { expect } = require('chai')
const jwt = require('jsonwebtoken')

const tokenKeys = require('../lib/constants/tokenKeys')
const { ALL } = require('../lib/constants/permissions')

const {
  verifyToken,
  signToken,
} = require('../lib/auth/tokens')

const testSecret = 'f172e23b79367c7fce47fa590a419c09c6f35ef53883758a82eec718c19dbc6de76e936d76f99bda11db36905a48aca5185200324e4a42966692fdd89ac8da23'

describe('auth/index.js', function () {
  beforeEach(function () { process.env.SECRET = testSecret })

  describe('#verifyToken()', function () {
    it('should verify a valid token', function (done) {
      const validToken = signToken({ username: 'jon', permissions: [ALL] })

      expect(verifyToken(validToken)).to.have.all.keys(...tokenKeys)
      done()
    })

    it('should not verify a token with an invalid signature', function (done) {
      const tokenWithInvalidSig = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1Njc4OTAiLCJwZXJtaXNzaW9ucyI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTk5OTk5OTl9.46zvtuy2InfpvKwUiPuSH0AGmYiTiv3Kc8pYL8bNMiY'

      expect(function () { verifyToken(tokenWithInvalidSig) }).to.throw('invalid signature')
      done()
    })

    it('should throw an error if an invalid token is provided', function (done) {
      expect(function () { verifyToken('ImLiterallyWritingTheseTestsToPractiseMochaAndChai') }).to.throw('jwt malformed')
      done()
    })

    it('should throw an error if an expired token is provided', function (done) {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1Njc4OTAiLCJwZXJtaXNzaW9ucyI6IkpvaG4gRG9lIiwiaWF0IjoxNTI5MjM5MDIyLCJleHAiOjE1MzYzOTE3Mjl9.GDv-aKqTlEWMxdWZD2M2N4n_oaYbDb6nB2jOydZC2yc'

      expect(function () { verifyToken(expiredToken) }).to.throw('jwt expired')
      done()
    })

    it('should throw an error if no token is provided', function (done) {
      expect(function () { verifyToken() }).to.throw('jwt must be provided')
      done()
    })
  })

  describe('#signToken()', function () {
    it('should return a valid token', function (done) {
      expect(/[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/.test(signToken({ username: 'testuser', permissions: [ALL] }))).to.be.true
      done()
    })

    it(`should return a token with valid keys (${tokenKeys.join(', ')})`, function (done) {
      const newToken = signToken({ username: 'testuser', permissions: [ALL] })
      expect(jwt.decode(newToken)).to.have.all.keys(...tokenKeys)
      done()
    })
  })

  afterEach(function () { process.env.SECRET = undefined })
})
