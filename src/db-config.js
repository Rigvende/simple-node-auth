const Sequelize = require("sequelize");
const sequelize = new Sequelize("UserDB", "postgres", "postgres", {
  dialect: "postgres",
});

module.exports = sequelize;