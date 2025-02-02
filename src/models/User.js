const sequelize = require('../dbConfig');
const { DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize, 
    modelName: 'user' 
  });

module.exports = User;
