const Sequelize = require("sequelize");
const NODE_ENV = process.env.NODE_ENV || 'development';

let sequelize;

if (NODE_ENV === 'production') {
    const { DATABASE_URL, DB_DIALECT } = process.env;
    sequelize = new Sequelize(DATABASE_URL, {
        dialect: DB_DIALECT,
        dialectOptions: {
            ssl: {
                ssl: true,
                rejectUnauthorized: false
            }
        },
        query: { raw: true },
    });    
} else {
    const { DB_NAME, DB_LOGIN, DB_PASSWORD, DB_DIALECT } = process.env;
    sequelize = new Sequelize(DB_NAME, DB_LOGIN, DB_PASSWORD, {
        dialect: DB_DIALECT,
        query: { raw: true }
    });
}

module.exports = sequelize;
