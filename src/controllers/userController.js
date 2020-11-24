const User = require('../models/User');
const handler = require('../responseCodesHandler.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['id', 'ASC']] });
        handler.send200(res, { users });
    } catch (err) {
        handler.send500(res);
    }
};

exports.create = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            handler.send400(res, errors, "Incorrect registration data");
        } else {
            const { name, age, email, password } = req.body;

            const foundUser = await User.findOne({ where: { email } });
            if (foundUser) {
                handler.send400(res, [], "User with such email has already existed!");
            }

            const hashedPassword = await bcrypt.hash(password, 13);
            const newUser = { name, age, email, password: hashedPassword };
            const {dataValues} = await User.create(newUser);
                        
            handler.send201(res, dataValues, `User ${dataValues.id} created successfully`);
        }
    } catch (err) {
        handler.send500(res);
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });
        handler.send200(res, { user });
    } catch (err) {
        handler.send500(res);
    }
};

exports.update = async (req, res) => {
    try {
        const { errors } = validationResult(req);

        if (errors.length > 0) {
            handler.send400(res, errors, "Incorrect edit data");
        } else {
            const { name, age } = req.body;
            const { id } = req.params;

            await User.update({ name, age }, { where: { id } });
            handler.send200(res, { message: `User ${id} updated successfully` });
        }
    } catch (err) {
        handler.send500(res);
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        handler.send200(res, { message: `User ${id} deleted successfully` });
    } catch (err) {
        handler.send500(res);
    }
};
