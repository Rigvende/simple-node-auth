const Sequelize = require("sequelize");

const {DB_NAME, DB_LOGIN, DB_PASSWORD, DB_DIALECT} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_LOGIN, DB_PASSWORD, {
  dialect: DB_DIALECT,
  query: {raw: true}
});

module.exports = sequelize;
