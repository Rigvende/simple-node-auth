const Sequelize = require("sequelize");

//for localhost:

// const {DB_NAME, DB_LOGIN, DB_PASSWORD, DB_DIALECT} = process.env;
// const sequelize = new Sequelize(DB_NAME, DB_LOGIN, DB_PASSWORD, {
// dialect: DB_DIALECT,
// query: {raw: true}
// }); 

//for heroku:

const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: { ssl: {
    ssl: true,
    rejectUnauthorized: false
  } },
  query: { raw: true },
});

module.exports = sequelize;
