const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { logger } = require('../logger.js');

exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const users = await User.findAll({
            order: [['id', 'ASC']],
            limit: [[pageSize]],
            offset: [[(page - 1) * pageSize]]
        });
        res.send200({ users, refresh: req.refresh });
    } catch (err) {
        logger.error(`Cannot find users! ${err}`);
        res.send500();
    }
};

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            logger.warn("Incorrect registration data");
            res.send400(errors, "Incorrect registration data");
        } else {
            const { name, age, email, password } = req.body;

            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                logger.warn("User with such email has already existed");
                res.send400([], "User with such email has already existed");
            }

            const hashedPassword = await bcrypt.hash(password, 13);
            const newUser = { name, age, email, password: hashedPassword };

            const { dataValues } = await User.create(newUser);
            logger.info("User created successful");
            res.send201(dataValues);
        }
    } catch (err) {
        logger.error(`Cannot create user! ${err}`);
        res.send500();
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        logger.info("User found");
        res.send200({ user, refresh: req.refresh });
    } catch (err) {
        logger.error(`Cannot find user! ${err}`);
        res.send500();
    }
};

exports.update = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            logger.warn("Incorrect edit data");
            res.send400(errors, "Incorrect edit data");
        } else {
            const { name, age } = req.body;
            const { id } = req.params;

            await User.update({ name, age }, { where: { id } });
            logger.info("User updated successful");
            res.send200({ refresh: req.refresh });
        }
    } catch (err) {
        logger.error(`Cannot update user! ${err}`);
        res.send500();
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const current = req.user.id;

        if (Number(id) === Number(current)) {
            logger.warn("Attempt to delete himself");
            res.send400(null, 'User cannot delete himself');
        } else {
            await User.destroy({ where: { id } });
            logger.info("User deleted successful");
            res.send200({ refresh: req.refresh });
        }
    } catch (err) {
        logger.error(`Cannot delete user! ${err}`);
        send500();
    }
};
