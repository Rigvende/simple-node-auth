const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.js');
const {loginChecks} = require('../validation.js');

// route: '/'

router.get("/", authController.getLoginPage);

router.get("/register", authController.getRegisterPage);

router.post("/auth", loginChecks, authController.login);

module.exports = router;