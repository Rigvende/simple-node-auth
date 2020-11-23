const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('../models/User')

router.get("/", function (req, res) {
  res.render("index.hbs");
});

router.post("/login", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const useremail = req.body.email;
  const userpassword = req.body.password;
  User.findAll({ where: { email: useremail, password: userpassword }, raw: true })
    .then((data) => {
      if (data.length > 0) {
        res.redirect("/list", {
          user: data[0]
        });
      } else {
        throw new Error("Wrong email/password");
      }
    }).catch(err => console.log(err));
});

router.get("/list", function (req, res) {
  User.findAll({ raw: true }).then(data => {
    res.render("list.hbs", {
      users: data
    });
  }).catch(err => console.log(err));
});

router.get("/register", function (req, res) {
  res.render("register.hbs");
});

router.post("/create", urlencodedParser, function (req, res) {
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
});

router.get("/edit/:id", function (req, res) {
  const userid = req.params.id;

  User.findAll({ where: { id: userid }, raw: true })
    .then(data => {
      res.render("edit.hbs", {
        user: data[0]
      });
    })
    .catch(err => console.log(err));
});

router.post("/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const username = req.body.name;
  const userage = req.body.age;
  const useremail = req.body.email;
  const userpassword = req.body.password;
  const userid = req.body.id;

  User.update({
    name: username,
    age: userage,
    email: useremail,
    password: userpassword
  },
    { where: { id: userid } })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
});

router.post("/delete/:id", function (req, res) {
  const userid = req.params.id;

  User.destroy({ where: { id: userid } }).then(() => {
    res.redirect("/");
  }).catch(err => console.log(err));
});

module.exports = router;
