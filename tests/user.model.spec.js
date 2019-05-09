const { expect } = require('chai')

const User = require('../models/user')
const { ALL } = require('../lib/constants/permissions')

const validBcryptHash = '$2a$10$F/IlKcN/sf5PDIvUxk9W9O8nnS2uzKfyrGPUaTX0xuGXwHSqs/96m'

describe('User model', function () {
  it('should validate correct data', function (done) {
    const newUser = new User({
      displayName: 'Jon',
      username: 'jon',
      password: validBcryptHash,
      permissions: [ALL],
    })

    newUser.validate((err) => {
      expect(err).to.be.null
      done()
    })
  })

  context('required fields missing', function () {
    it('should not validate if displayName is missing', function (done) {
      const newUser = new User({
        username: 'jon',
        password: validBcryptHash,
        permissions: [ALL],
      })

      newUser.validate((err) => {
        expect(err.displayName).not.to.be.null
        done()
      })
    })

    it('should not validate if username is missing', function (done) {
      const newUser = new User({
        displayName: 'Jon',
        password: validBcryptHash,
        permissions: [ALL],
      })

      newUser.validate((err) => {
        expect(err.username).not.to.be.null
        done()
      })
    })

    it('should not validate if password is missing', function (done) {
      const newUser = new User({
        displayName: 'Jon',
        username: 'jon',
        permissions: [ALL],
      })

      newUser.validate((err) => {
        expect(err.password).not.to.be.null
        done()
      })
    })

    it('should not validate if permissions is missing', function (done) {
      const newUser = new User({
        displayName: 'Jon',
        username: 'jon',
        password: validBcryptHash,
      })

      newUser.validate((err) => {
        expect(err.permissions).not.to.be.null
        done()
      })
    })
  })

  it('should not validate a new user with incorrect permissions', function (done) {
    const newUser = new User({
      displayName: 'Jon',
      username: 'jon',
      password: validBcryptHash,
      permissions: [ALL, 'NOTAPERMISSIONS'],
    })

    newUser.validate((err) => {
      expect(err.errors.permissions).not.to.be.null
      done()
    })
  })

  it('should not validate a new user with an invalid password hash', function (done) {
    const newUser = new User({
      displayName: 'Jon',
      username: 'jon',
      password: 'definitely not a bcrypt hash',
      permissions: [ALL],
    })

    newUser.validate((err) => {
      expect(err.errors.password).not.to.be.null
      done()
    })
  })
})
