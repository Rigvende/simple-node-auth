const User = require('../models/User');
const handler = require('../errorHandler.js');
const { validationResult } = require('express-validator');

exports.getMainPage = (req, res) =>
    res.send(`<h1>Hello from authentication-trainee!</h1>`);

exports.login = (req, res) => {
    const { errors } = validationResult(req);

    if (errors.length > 0)
        handler.send400(res, errors, "Incorrect login data");
    else {
        const { email, password } = req.body;

        User.findAll({ where: { email: email, password: password } })
            .then((data) => {
                if (data.length > 0) res.redirect("/users");
                else handler.send401(res);
            })
            .catch(err => handler.send500(res));
    }
};
