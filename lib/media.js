const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const { media, Op } = require('../models')

const mediaDirectory = `${__dirname}/../content/media`

const extensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

const generateThumbnail = input => new Promise((resolve, reject) => {
  sharp(input)
    .background({
      r: 200,
      g: 200,
      b: 200,
      alpha: 1,
    })
    .flatten()
    .jpeg({ quality: 50 })
    .resize({ width: 256, height: 144 })
    .toBuffer()
    .then(resizedImageBuffer => resolve(resizedImageBuffer))
    .catch(err => reject(err))
})

const deactivateOtherMedia = id => new Promise((resolve, reject) => {
  media.update({ active: false }, {
    where:
    { [Op.and]: [{ active: true }, { id: { [Op.ne]: id } }] },
  })
    .then(updatedMedia => resolve(updatedMedia))
    .catch(UpdateActiveError => reject(UpdateActiveError))
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
            mimetype,
            active: active === 'true',
          })
            .then((newContent) => {
              if (active === 'true') {
                deactivateOtherMedia(id)
              }

              resolve(newContent)
            })
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

const getMedia = (id, thumbnail) => new Promise((resolve, reject) => {
  media.findOne({ where: { id } })
    .then((activeMedia) => {
      fs.readFile(`${mediaDirectory}/${thumbnail ? 'thumbnails/' : ''}${activeMedia.id}.${thumbnail ? 'jpg' : extensions[activeMedia.mimetype]}`, (readMediaError, data) => {
        if (readMediaError) reject(readMediaError)

        resolve(data)
      })
    })
    .catch(error => reject(error))
})

const getActiveMediaMetadata = () => new Promise((resolve, reject) => {
  media.findOne({ where: { active: true } })
    .then(activeMedia => resolve(activeMedia))
    .catch(getActiveMediaError => reject(getActiveMediaError))
})

const getMediaMetadataById = id => new Promise((resolve, reject) => {
  media.findOne({ where: { id } })
    .then(metadata => resolve(metadata))
    .catch(getMediaMetadataError => reject(getMediaMetadataError))
})

const deleteMediaById = id => new Promise((resolve, reject) => {
  media.findOne({ where: { id } })
    .then((deleteMedia) => {
      deleteMedia.destroy()
        .then(() => {
          fs.unlink(path.resolve(`${mediaDirectory}/${id}.${extensions[deleteMedia.mimetype]}`), err => reject(err))
          fs.unlink(path.resolve(`${mediaDirectory}/thumbnails/${id}.jpg`), err => reject(err))
          resolve({ deletedMediaId: id })
        })
        .catch(deleteDBObjectError => reject(deleteDBObjectError))
    })
})

const updateMediaById = (id, updatedMedia) => new Promise((resolve, reject) => {
  media.findOne({ where: { id } })
    .then(updateMedia => updateMedia
      .update(updatedMedia)
      .then((newMedia) => {
        if (updatedMedia.active === 'true') {
          deactivateOtherMedia(id)
        }

        resolve(newMedia)
      }))
    .catch(updateMediaError => reject(updateMediaError))
})

const pruneMediaFiles = () => new Promise((resolve, reject) => {
  media.findAll({ attributes: ['id'] })
    .then((data) => {
      const liveIds = data.map(i => i.id)

      fs.readdir(mediaDirectory, (err, files) => {
        if (err) reject(err)

        const zombieFiles = files
          .filter(file => /[0-9a-f]{8}./.test(file))
          .filter(file => liveIds.indexOf(file.slice(0, 8)) === -1)

        zombieFiles
          .forEach((file) => {
            const zombieMediaPath = `${mediaDirectory}/${file}`
            const zombieMediaThumbnailPath = `${mediaDirectory}/thumbnails/${file}`

            fs.unlink(zombieMediaPath, ((unlinkMediaError) => {
              if (unlinkMediaError) reject(unlinkMediaError)
            }))

            fs.unlink(zombieMediaThumbnailPath, ((unlinkMediaThumbnailError) => {
              if (unlinkMediaThumbnailError) reject(unlinkMediaThumbnailError)
            }))
          })

        resolve({ deletedFileIds: zombieFiles })
      })
    })
})

module.exports = {
  addMedia,
  deleteMediaById,
  generateThumbnail,
  getActiveMediaMetadata,
  getMedia,
  getMediaMetadataById,
  pruneMediaFiles,
  updateMediaById,
}
