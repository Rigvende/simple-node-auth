const User = require('../models/User');
const handler = require('../errorHandler.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAll = (req, res) =>
    User.findAll({ order: [['id', 'ASC']] })
        .then(data => res.status(200).json({ users: data }))
        .catch(err => handler.send500(res));

exports.create = (req, res) => {
    const { errors } = validationResult(req);

    if (errors.length > 0)
        handler.send400(res, errors, "Incorrect registration data");
    else {
        const { name, age, email, password } = req.body;

        User.findAll({ where: { email: email } })
            .then(async (data) => {
                if (data.length > 0)
                    handler.send400(res, [], "User with such email has already existed!");

                const hashedPassword = await bcrypt.hash(password, 13);

                User.create({ name, age, email, password: hashedPassword })
                    .then(() => res.redirect("/"))
                    .catch(err => handler.send500(res));
            })
            .catch(err => handler.send500(res));
    }
};

exports.findById = (req, res) => {
    const userid = req.params.id;

    User.findAll({ where: { id: userid } })
        .then(data => res.status(200).json({ user: data[0] }))
        .catch(err => handler.send500(res));
};

exports.update = (req, res) => {
    const { errors } = validationResult(req);

    if (errors.length > 0)
        handler.sendCustom400(res, errors, "Incorrect edit data");
    else {
        const { name, age } = req.body;
        const userid = req.params.id;

        User.update({ name, age },
            { where: { id: userid } })
            .then(() => res.redirect("/users"))
            .catch(err => handler.send500(res));
    }
};

exports.delete = (req, res) => {
    const userid = req.params.id;

    User.destroy({ where: { id: userid } })
        .then(() => res.redirect("/users"))
        .catch(err => handler.send500(res));
};
