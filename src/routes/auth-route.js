const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", authController.getLoginPage);

router.get("/register", authController.register);

router.post("/auth", urlencodedParser, authController.login);

module.exports = router;