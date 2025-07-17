const Sequelize = require('sequelize');
const logger = require('../utils/logger');

const database = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: (msg) => logger.info(msg),
  define: {
    freezeTableName: true,
  },
});

module.exports = database;
