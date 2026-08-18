require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/verde_db',
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    url: process.env.DATABASE_URL_TEST || 'mysql://root:@localhost:3306/verde_db_test',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
