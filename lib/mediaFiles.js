const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const extensions = require('./constants/fileExtensions')

const { MEDIA } = require('./constants/paths')

const generateThumbnail = async (data) => {
  await sharp(data)
    .flatten({
      background: {
        r: 255,
        g: 255,
        b: 255,
      },
    })
    .jpeg({ quality: 50 })
    .resize({ width: 256, height: 144 })
    .toBuffer()
}

const generateFilePaths = (id, mimetype) => ([
  path.resolve(`${MEDIA}/${id}.${extensions[mimetype]}`),
  path.resolve(`${MEDIA}/thumbnails/${id}.jpg`),
])

const deleteMediaFiles = (id, mimetype) => {
  const [uploadFileTarget, uploadThumbnailTarget] = generateFilePaths(id, mimetype)

  fs.unlink(uploadFileTarget, (deleteError) => {
    if (deleteError) {
      throw new Error(`Error deleting file: ${deleteError}`)
    }
  })

  fs.unlink(uploadThumbnailTarget, (deleteError) => {
    if (deleteError) {
      throw new Error(`Error deleting thumbnail: ${deleteError}`)
    }
  })
}

const createMediaFiles = (id, mimetype, data) => new Promise((resolve, reject) => {
  const [uploadFileTarget, uploadThumbnailTarget] = generateFilePaths(id, mimetype)

  const thumbnail = generateThumbnail(data)

  fs.writeFile(uploadFileTarget, data, (fileError) => {
    if (!fileError) {
      fs.writeFile(uploadThumbnailTarget, thumbnail, (thumbnailError) => {
        if (!thumbnailError) {
          resolve([uploadFileTarget, uploadThumbnailTarget])
        } else {
          deleteMediaFiles(id, mimetype)
            .then(() => reject(new Error('Couldn\'t upload files.')))
            .catch(error => new Error(`Caught an error while clearing up files: ${error}`))
        }
      })
    }
  })
})

module.exports = {
  createMediaFiles,
  deleteMediaFiles,
}
