const mongoose = require('mongoose')

const { deleteMediaFiles } = require('../lib/mediaFiles')

const { Schema } = mongoose

const mediaSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  mimetype: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png'],
  },
})

mediaSchema.post('findOneAndDelete', (media) => {
  if (media) {
    deleteMediaFiles(media._id, media.mimetype)
  }
})

module.exports = mongoose.model('Media', mediaSchema)
