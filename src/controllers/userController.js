const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { logger } = require('../logger.js');

exports.getAll = (req, res) => {
    try {
        const { users, limit, length, refresh } = req;
        res.send200({ users, limit, length, refresh });  
    } catch (err) {
        logger.error(`Something goes wrong. ${err}`);
        return res.send500();
    }

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            logger.warn("Incorrect registration data");
            return res.send400(errors, "Incorrect registration data");
        }
        const { name, age, email, password } = req.body;

        const foundUser = await User.findOne({ where: { email } });
        if (foundUser) {
            logger.warn("User with such email has already existed");
            return res.send400([], "User with such email has already existed");
        }

        const hashedPassword = await bcrypt.hash(password, 13);
        const newUser = { name, age, email, password: hashedPassword };

        const { dataValues } = await User.create(newUser);
        logger.info("User created successful");
        return res.send201(dataValues);
    } catch (err) {
        logger.error(`Cannot create user! ${err}`);
        return res.send500();
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        logger.info("User found");
        return res.send200({ user, refresh: req.refresh });
    } catch (err) {
        logger.error(`Cannot find user! ${err}`);
        return res.send500();
    }
};

exports.update = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            logger.warn("Incorrect edit data");
            return res.send400(errors, "Incorrect edit data");
        }

        const { name, age } = req.body;
        const { id } = req.params;

        await User.update({ name, age }, { where: { id } });
        logger.info("User updated successful");
        return res.send200({ refresh: req.refresh });
    } catch (err) {
        logger.error(`Cannot update user! ${err}`);
        return res.send500();
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const current = req.user.id;

        if (Number(id) === Number(current)) {
            logger.warn("Attempt to delete himself");
            return res.send400(null, 'User cannot delete himself');
        }

        await User.destroy({ where: { id } });
        logger.info("User deleted successful");
        return res.send200({ refresh: req.refresh });
    } catch (err) {
        logger.error(`Cannot delete user! ${err}`);
        return res.send500();
    }
};
