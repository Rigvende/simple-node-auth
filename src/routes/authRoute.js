const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const validation = require('../validation/authValidation.js');
const auth = require('../middleware/auth.middleware');

// route: '/'

router.get("/", authController.getMainPage);

router.post("/auth", validation.loginValidation, authController.login);

router.get("/logout", auth, authController.logout);

module.exports = router;
