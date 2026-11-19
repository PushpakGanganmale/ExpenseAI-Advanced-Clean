const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,

    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    retry: {
      max: 3,
    },

    define: {
      timestamps: true,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');

    if (!isProduction && process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.log('Development database synced successfully');
    }

    return sequelize;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await sequelize.close();
    console.log('PostgreSQL connection closed');
  } catch (error) {
    console.error('Database disconnection failed:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB,
  disconnectDB,
};
