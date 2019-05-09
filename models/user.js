const mongoose = require('mongoose')

const permissions = require('../lib/constants/permissions')

const { Schema } = mongoose

const userSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: input => /\$2a\$10\$[a-zA-Z0-9/.]{53}/.test(input),
      message: 'Invalid password hash.',
    },
  },
  permissions: {
    type: Array,
    required: true,
    validate: {
      validator: input => input
        .map(inputItem => Object.values(permissions).includes(inputItem))
        .reduce((accumulator, current) => ((accumulator && current) ? current : false)),
      message: 'Invalid permissions provided.',
    },
  },
})

module.exports = mongoose.model('User', userSchema)
