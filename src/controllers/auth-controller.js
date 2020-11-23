const User = require('../models/User');
const handler = require('../error-handler.js');
const { validationResult } = require('express-validator');

exports.getLoginPage = function (req, res) {
    res.render("index.hbs");
};

exports.getRegisterPage = function (req, res) {
    res.render("register.hbs");
};

exports.login = function (req, res) {
    if (!req.body) {
        handler.send400(res);
    }

    const result = validationResult(req);
    const errors = result.errors;

    if (!errors.isEmpty) {
        handler.sendCustom400(res, errors, "Incorrect login data");
    } else {
        const { email, password } = req.body;

        User.findAll({ where: { email: email, password: password }, raw: true })
            .then((data) => {
                if (data.length > 0) {
                    res.redirect("/users");
                } else {
                    handler.send401(res);
                }
            })
            .catch(err => handler.send500(res, err));
    }
};