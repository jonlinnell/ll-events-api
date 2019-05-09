const { expect } = require('chai')

const Media = require('../models/media')

describe('Media model', function () {
  it('should validate correct data', function (done) {
    const media = new Media({ title: 'Test', mimetype: 'image/png' })

    media.validate((err) => {
      expect(err).to.not.exist
      done()
    })
  })

  it('should give an error creating an entry without a title', function (done) {
    const media = new Media({ mimetype: 'image/png' })

    media.validate((err) => {
      expect(err.errors.title).to.exist
      done()
    })
  })

  it('should give an error creating an entry with an invalid mimetype', function (done) {
    const media = new Media({ tite: 'Not an image', mimetype: 'audio/mpeg' })

    media.validate((err) => {
      expect(err.errors.mimetype).to.exist
      done()
    })
  })

  it('should give an error creating an empty entry', function (done) {
    const media = new Media({})

    media.validate((err) => {
      expect(err.errors).to.exist
      done()
    })
  })
})
