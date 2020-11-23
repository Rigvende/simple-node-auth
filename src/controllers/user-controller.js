const User = require('../models/User');
const handler = require('../error-handler.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.findAll = function (req, res) {
    User.findAll({ order: [['id', 'ASC']], raw: true })
        .then(data => {
            res.render("list.hbs", {
                users: data
            });
        })
        .catch(err => handler.send500(res, err));
};

exports.add = function (req, res) {
    if (!req.body) {
        handler.send400(res);
    }

    const result = validationResult(req);
    const errors = result.errors;

    if (errors.length > 0) {
        handler.sendCustom400(res, errors, "Incorrect registration data");
    } else {
        const { name, age, email, password } = req.body;

        User.findAll({ where: { email: email }, raw: true })
            .then(async (data) => {
                if (data.length > 0) {
                    return res.status(400).json({ message: "User with such email has already existed!" })
                }

                const hashedPassword = await bcrypt.hash(password, 13);

                User.create({ name, age, email, password: hashedPassword })
                    .then(() => {
                        res.redirect("/");
                    })
                    .catch(err => handler.send500(res, err));
            })
            .catch(err => handler.send500(res, err));
    }
};

exports.findById = function (req, res) {
    const userid = req.params.id;

    User.findAll({ where: { id: userid }, raw: true })
        .then(data => {
            res.render("edit.hbs", {
                user: data[0]
            });
        })
        .catch(err => handler.send500(res, err));
};

exports.edit = function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const result = validationResult(req);
    const errors = result.errors;

    if (errors.length > 0) {
        handler.sendCustom400(res, errors, "Incorrect edit data");
    } else {
        const { name, age } = req.body;
        const userid = req.params.id;

        User.update({ name, age },
            { where: { id: userid } })
            .then(() => {
                res.redirect("/users");
            })
            .catch(err => handler.send500(res, err));
    }
};

exports.delete = function (req, res) {
    const userid = req.params.id;

    User.destroy({ where: { id: userid } })
        .then(() => {
            res.redirect("/users");
        })
        .catch(err => handler.send500(res, err));
};
