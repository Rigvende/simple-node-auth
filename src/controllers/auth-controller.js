const User = require('../models/User');

exports.getLoginPage = function (req, res) {
    res.render("index.hbs");
};

exports.register = function (req, res) {
    res.render("register.hbs");
};

exports.login = function (req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const useremail = req.body.email;
    const userpassword = req.body.password;
    User.findAll({ where: { email: useremail, password: userpassword }, raw: true })
        .then((data) => {
            if (data.length > 0) {
                res.redirect("/users");
            } else {
                res.status(401).send(`${res.statusCode}: Wrong email/password`);
            }
        }).catch(err => console.log(err));
};