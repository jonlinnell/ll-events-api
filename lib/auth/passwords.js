const bcrypt = require('bcryptjs')

const saltRounds = 10

const hashPassword = cleartextPassword => bcrypt.hashSync(cleartextPassword, saltRounds)

const checkPassword = (submittedPassword, hash) => bcrypt.compareSync(submittedPassword, hash)

module.exports = {
  hashPassword,
  checkPassword,
}
