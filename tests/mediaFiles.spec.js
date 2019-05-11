// const rewire = require('rewire')
const { expect } = require('chai')
const path = require('path')
const fs = require('fs')

const { MEDIA } = require('../lib/constants/paths')

const {
  generateFilePaths,
  generateThumbnail,
  createMediaFiles,
  deleteMediaFiles,
} = require('../lib/media/mediaFiles')

describe('lib/media/mediaFiles.js', function () {
  const testImageData = fs.readFileSync(path.resolve(`${__dirname}/testData/test.png`))

  describe('#generateFilePaths()', function () {
    it('should generate accurate file paths', function () {
      const [imagePath, thumbnailPath] = generateFilePaths('__test__', 'image/png')

      expect(imagePath).to.equal(path.resolve(`${MEDIA}/__test__.png`))
      expect(thumbnailPath).to.equal(path.resolve(`${MEDIA}/thumbnails/__test__.jpg`))
    })
  })

  describe('#generateThumbnail()', function () {
    it('should generate a valid JPEG file from a PNG', function (done) {
      generateThumbnail(testImageData)
        .then((thumbnail) => {
          expect(thumbnail.toString('hex').slice(0, 4)).to.equal('ffd8')
          done()
        })
    })
  })

  describe('#createMediaFiles()', function () {
    it('should create an image and thumbnail file in the right place', function (done) {
      createMediaFiles('__test__', 'image/png', testImageData)
        .then((files) => {
          files.forEach((file) => {
            expect(fs.existsSync(file)).to.be.true
            fs.unlinkSync(file)
          })

          done()
        })
    })
  })

  describe('#deleteMediaFiles()', function () {
    it('should delete an image and thumbnail', function (done) {
      const files = generateFilePaths('__test__', 'image/png')

      files.forEach((file) => {
        fs.writeFileSync(file, 'somerandomdata')
      })

      deleteMediaFiles('__test__', 'image/png')

      files.forEach((file) => {
        expect(fs.existsSync(file)).to.not.be.true
      })

      done()
    })
  })
})
