const User = require('../models/User');
const handler = require('../error-handler.js');

exports.getLoginPage = function (req, res) {
    res.render("index.hbs");
};

exports.register = function (req, res) {
    res.render("register.hbs");
};

exports.login = function (req, res) {
    if (!req.body) {
        handler.send400(res);
    }

    const {email, password} = req.body;

    User.findAll({ where: { email: email, password: password }, raw: true })
        .then((data) => {
            if (data.length > 0) {
                res.redirect("/users");
            } else {
                handler.send401(res);
            }
        }).catch(err => handler.send500(res, err));
};