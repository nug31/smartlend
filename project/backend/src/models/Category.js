const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Package'
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#3b82f6'
  },
  itemCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Category;
