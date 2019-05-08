const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const extensions = require('./constants/fileExtensions')

const { MEDIA } = require('./constants/paths')

const generateThumbnail = data => sharp(data)
  .flatten({
    background: {
      r: 255,
      g: 255,
      b: 255,
    },
  })
  .jpeg({ quality: 50 })
  .resize({
    width: 256,
    height: 144,
    fit: 'contain',
    background: {
      r: 255,
      g: 255,
      b: 255,
    },
  })
  .toBuffer()
  .then(thumbnail => thumbnail)
  .catch(thumbnailError => new Error(`Error generating thumbnail: ${thumbnailError}`))

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

  fs.writeFile(uploadFileTarget, data, (fileError) => {
    if (!fileError) {
      generateThumbnail(data)
        .then((thumbnail) => {
          fs.writeFile(uploadThumbnailTarget, thumbnail, (thumbnailError) => {
            if (!thumbnailError) {
              resolve([uploadFileTarget, uploadThumbnailTarget])
            } else {
              deleteMediaFiles(id, mimetype)
                .then(() => reject(new Error('Couldn\'t upload files.')))
                .catch(error => new Error(`Caught an error while clearing up files: ${error}`))
            }
          })
        })
    }
  })
})

const pruneMediaFiles = () => new Promise((resolve) => {
  resolve('Not yet implemented.') // @todo write this functionality.
})

module.exports = {
  createMediaFiles,
  deleteMediaFiles,
  pruneMediaFiles,
}
