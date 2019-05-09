const fs = require('fs')
const path = require('path')

const Media = require('../../models/media')

const extensions = require('../constants/fileExtensions')
const { MEDIA } = require('../constants/paths')

const { createMediaFiles, deleteMediaFiles } = require('./mediaFiles')

const getMedia = ({ skip, limit }) => new Promise((resolve, reject) => {
  Media.find({}, null, {
    limit: parseInt(limit, 10),
    skip: parseInt(skip, 10),
    sort: { _id: -1 },
  }, (error, media) => {
    if (error) {
      reject(new Error(`Error getting all media: ${error}`))
    } else {
      resolve(media)
    }
  })
})

const addMedia = req => new Promise((resolve, reject) => {
  const { data, mimetype } = req.files.file
  const { title } = req.body

  const newMedia = new Media({ title, mimetype })

  createMediaFiles(newMedia._id, mimetype, data)
    .then(() => {
      newMedia
        .save((saveError) => {
          if (saveError) {
            deleteMediaFiles(newMedia._id, mimetype)
            reject(new Error(`There was an error while saving the document: ${saveError}`))
          } else {
            resolve(newMedia)
          }
        })
    })
    .catch((fileError) => {
      deleteMediaFiles(newMedia._id, mimetype)
      reject(new Error(`There was an error while saving the media files: ${fileError}`))
    })
})

const getMediaData = (id, getThumbnail) => new Promise((resolve, reject) => {
  Media.findById(id, (findMediaError, media) => {
    if (findMediaError) {
      reject(new Error(findMediaError))
    } else if (!media) {
      reject(new Error('No media found for this ID.'))
    } else {
      fs.readFile(
        path.resolve(`${MEDIA}/${getThumbnail ? 'thumbnails/' : ''}${media._id}.${
          getThumbnail ? 'jpg' : extensions[media.mimetype]
        }`),
        (readMediaError, data) => {
          if (readMediaError) {
            reject(readMediaError)
          } else {
            resolve(data)
          }
        },
      )
    }
  })
})

const deleteMediaById = id => new Promise((resolve, reject) => {
  Media.findByIdAndDelete(id, (error, media) => {
    if (error) {
      reject(new Error(error))
    } else if (media instanceof Media) {
      resolve(media)
    } else {
      resolve('Media not found')
    }
  })
})

const updateMediaById = (id, updateData) => new Promise((resolve, reject) => {
  Media.findByIdAndUpdate(id, updateData, { new: true }, (updateError, updatedMedia) => {
    if (updateError) {
      reject(new Error(updateError))
    } else {
      resolve(updatedMedia)
    }
  })
})

module.exports = {
  addMedia,
  deleteMediaById,
  // getActiveMediaMetadata,
  getMedia,
  getMediaData,
  // getMediaMetadataById,
  // pruneMediaFiles,
  updateMediaById,
}
