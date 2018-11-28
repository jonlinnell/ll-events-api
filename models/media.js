module.exports = (sequelize, DataTypes) => sequelize.define('media', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
})
