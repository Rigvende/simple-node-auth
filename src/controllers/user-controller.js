const User = require('../models/User');

exports.findAll = function (req, res) {
    User.findAll({ order: [['id', 'ASC']], raw: true }).then(data => {
        res.render("list.hbs", {
            users: data
        });
    }).catch(err => console.log(err));
};

exports.add = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const username = req.body.name;
    const userage = req.body.age;
    const useremail = req.body.email;
    const userpassword = req.body.password;

    User.create({
        name: username,
        age: userage,
        email: useremail,
        password: userpassword
    })
        .then(() => {
            res.redirect("/");
        }).catch(err => console.log(err));
};

exports.findById = function (req, res) {
    const userid = req.params.id;

    User.findAll({ where: { id: userid }, raw: true })
        .then(data => {
            res.render("edit.hbs", {
                user: data[0]
            });
        })
        .catch(err => console.log(err));
};

exports.edit = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const username = req.body.name;
    const userage = req.body.age;
    const useremail = req.body.email;
    const userpassword = req.body.password;
    const userid = req.params.id;

    User.update({
        name: username,
        age: userage,
        email: useremail,
        password: userpassword
    },
        { where: { id: userid } })
        .then(() => {
            res.redirect("/users");
        })
        .catch(err => console.log(err));
};

exports.delete = function (req, res) {
    const userid = req.params.id;

    User.destroy({ where: { id: userid } }).then(() => {
        res.redirect("/users");
    }).catch(err => console.log(err));
};
