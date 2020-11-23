const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.js');

// '/' route

router.get("/", authController.getLoginPage);

router.get("/register", authController.register);

router.post("/auth", authController.login);

module.exports = router;