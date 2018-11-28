const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { media } = require('../models')

const mediaDirectory = `${__dirname}/../content/media`

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

const generateThumbnail = input => new Promise((resolve, reject) => {
  sharp(input)
    .jpeg({ quality: 50 })
    .resize({ width: 320, height: 240 })
    .toBuffer()
    .then(resizedImageBuffer => resolve(resizedImageBuffer))
    .catch(err => reject(err))
})

const addMedia = req => new Promise((resolve, reject) => {
  const { data, mimetype } = req.files.file
  const { active, title } = req.body

  const id = crypto.randomBytes(4).toString('hex')

  const uploadFileTarget = path.resolve(`${mediaDirectory}/${id}.${extensions[mimetype]}`)
  const uploadThumbnailTarget = path.resolve(`${mediaDirectory}/thumbnails/${id}.jpg`)

  generateThumbnail(data)
    .then((thumbnail) => {
      fs.writeFile(uploadThumbnailTarget, thumbnail, (writeThumbnailError) => {
        if (writeThumbnailError) reject(writeThumbnailError)

        fs.writeFile(uploadFileTarget, data, (writeFileError) => {
          if (writeFileError) reject(writeFileError)

          media.create({
            id,
            title,
            active: active === true || false,
          })
            .then(newContent => resolve(newContent))
            .catch((databaseError) => {
              fs.unlink(uploadFileTarget, () => {})
              fs.unlink(uploadThumbnailTarget, () => {})
              reject(databaseError)
            })
        })
      })
    })
    .catch(thumbnailError => reject(thumbnailError))
})

const getActiveMedia = () => new Promise((resolve, reject) => {
  media.findOne({ where: { active: true } })
    .then(data => resolve(data))
    .catch(error => reject(error))
})

module.exports = {
  generateThumbnail,
  getActiveMedia,
  addMedia,
}
