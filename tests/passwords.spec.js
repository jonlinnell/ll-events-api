const { expect } = require('chai')

const { hashPassword, checkPassword } = require('../lib/auth/passwords')

describe('auth/passwords.js', function () {
  const hashedPassword = hashPassword('password')

  describe('#hashPassword()', function () {
    it('should generate a valid bcrypt hash from a cleartext password', function () {
      expect(/\$2a\$10\$[a-zA-Z0-9/.]{53}/.test(hashedPassword)).to.be.true
    })
  })

  describe('#checkPassword()', function () {
    it('should match a correct cleartext password', function () {
      expect(checkPassword('password', hashedPassword)).to.be.true
    })

    it('should fail to match an incorrect password', function () {
      expect(checkPassword('hunter2', hashedPassword)).to.not.be.true
    })
  })
})
