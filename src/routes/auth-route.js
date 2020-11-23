const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.js');
const {check} = require('express-validator');

// '/' route

const loginChecks = [
    check('email', 'Invalid email').isEmail().isLength({min: 10, max: 255}),
    check('password', 'Invalid passport length').isLength({ min: 3, max: 20 })
];

router.get("/", authController.getLoginPage);

router.get("/register", authController.getRegisterPage);

router.post("/auth", loginChecks, authController.login);

module.exports = router;