const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['id', 'ASC']] });
        res.send200(res, { users, refresh: req.refresh });
    } catch (err) {
        res.send500(res);
    }
};

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.send400(res, errors, "Incorrect registration data");
        } else {
            const { name, age, email, password } = req.body;

            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                res.send400(res, [], "User with such email has already existed!");
            }

            const hashedPassword = await bcrypt.hash(password, 13);
            const newUser = { name, age, email, password: hashedPassword };

            const { dataValues } = await User.create(newUser);
            res.send201(res, dataValues);
        }
    } catch (err) {
        res.send500(res);
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        res.send200(res, { user, refresh: req.refresh });
    } catch (err) {
        res.send500(res);
    }
};

exports.update = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            res.send400(res, errors, "Incorrect edit data");
        } else {
            const { name, age } = req.body;
            const { id } = req.params;

            await User.update({ name, age }, { where: { id } });
            res.send200(res, { refresh: req.refresh });
        }
    } catch (err) {
        res.send500(res);
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const current = req.user.id;
    
        if (Number(id) === Number(current)) {
            res.send400(res, null, 'User cannot delete himself');
        } else {
            await User.destroy({ where: { id } });
            res.send200(res, { refresh: req.refresh });
        }
    } catch (err) {
        send500(res);
    }
};
