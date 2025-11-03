const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    }
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  maintenanceSchedule: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Item;