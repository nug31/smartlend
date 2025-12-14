const User = require('./User.js');
const Item = require('./Item.js');
const Loan = require('./Loan.js');
const Category = require('./Category.js');

// Define associations
User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loans' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'approvedBy', as: 'approvedLoans' });
Loan.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

module.exports = { User, Item, Loan, Category };