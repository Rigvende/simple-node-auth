const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const validation = require('../validation/authValidation.js');

// route: '/'

router.get("/", authController.getMainPage);

router.post("/auth", validation.loginValidation, authController.login);

module.exports = router;
