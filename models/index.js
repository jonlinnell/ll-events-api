const Sequelize = require('sequelize')
const path = require('path')
const fs = require('fs')

const {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_USER,
  NODE_ENV,
} = process.env

const dbConfig = {
  development: {
    dialect: 'mysql',
    host: DB_HOST,
  },
  production: {
    dialect: 'mysql',
    host: DB_HOST,
  },
}

const db = {}

console.log(DB_NAME)

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, dbConfig[NODE_ENV || 'development'])

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.sequelize = sequelize
db.Op = Sequelize.Op

module.exports = db
