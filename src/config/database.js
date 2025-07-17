const Sequelize = require('sequelize');
const logger = require('../utils/logger');

// Determine dialect from DATABASE_URL
const getDatabaseConfig = (url) => {
  if (url.startsWith('sqlite:')) {
    return {
      dialect: 'sqlite',
      storage: url.replace('sqlite:', ''),
      logging: (msg) => logger.info(msg),
      define: {
        freezeTableName: true,
      },
    };
  }
  
  // Default to PostgreSQL
  return {
    dialect: 'postgres',
    logging: (msg) => logger.info(msg),
    define: {
      freezeTableName: true,
    },
  };
};

const config = getDatabaseConfig(process.env.DATABASE_URL);
const database = new Sequelize(process.env.DATABASE_URL, config);

module.exports = database;
