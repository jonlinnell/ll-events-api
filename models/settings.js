module.exports = (sequelize, DataTypes) => sequelize.define('settings', {
  key: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})
