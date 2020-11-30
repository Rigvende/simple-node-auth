const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['id', 'ASC']] });
        res.send200({ users, refresh: req.refresh });
    } catch (err) {
        res.send500();
    }
};

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.send400(errors, "Incorrect registration data");
        } else {
            const { name, age, email, password } = req.body;

            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                res.send400([], "User with such email has already existed!");
            }

            const hashedPassword = await bcrypt.hash(password, 13);
            const newUser = { name, age, email, password: hashedPassword };

            const { dataValues } = await User.create(newUser);
            res.send201(dataValues);
        }
    } catch (err) {
        res.send500();
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        res.send200({ user, refresh: req.refresh });
    } catch (err) {
        res.send500();
    }
};

exports.update = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.send400(errors, "Incorrect edit data");
        } else {
            const { name, age } = req.body;
            const { id } = req.params;

            await User.update({ name, age }, { where: { id } });
            res.send200({ refresh: req.refresh });
        }
    } catch (err) {
        res.send500();
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const current = req.user.id;
    
        if (Number(id) === Number(current)) {
            res.send400(null, 'User cannot delete himself');
        } else {
            await User.destroy({ where: { id } });
            res.send200({ refresh: req.refresh });
        }
    } catch (err) {
        send500();
    }
};
