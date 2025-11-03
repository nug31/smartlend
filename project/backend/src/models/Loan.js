const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Items',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actualReturnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'active', 'overdue', 'returned', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  requestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  remindersSent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  extensionRequested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  extensionApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  extensionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Loan;