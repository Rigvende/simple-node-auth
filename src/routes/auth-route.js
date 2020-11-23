const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('../models/User')

router.get("/", function (req, res) {
    res.render("index.hbs");
});

router.get("/register", function (req, res) {
    res.render("register.hbs");
});

router.post("/auth", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const useremail = req.body.email;
    const userpassword = req.body.password;
    User.findAll({ where: { email: useremail, password: userpassword }, raw: true })
        .then((data) => {
            if (data.length > 0) {
                res.redirect("/users");
            } else {
                throw new Error("Wrong email/password");
            }
        }).catch(err => console.log(err));
});

module.exports = router;