const Sequelize = require("sequelize");

const DB_NAME = process.env.DB_NAME;
const DB_LOGIN = process.env.DB_LOGIN;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DIALECT = process.env.DB_DIALECT;

const sequelize = new Sequelize(DB_NAME, DB_LOGIN, DB_PASSWORD, {
  dialect: DB_DIALECT,
  query: {raw: true}
});

module.exports = sequelize;
