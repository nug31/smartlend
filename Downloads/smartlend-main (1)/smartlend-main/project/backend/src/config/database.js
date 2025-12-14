const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Use PostgreSQL with DATABASE_URL (Railway) or SQLite for local development
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });

module.exports = sequelize;