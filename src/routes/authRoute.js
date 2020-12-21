const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const validation = require('../validation/authValidation.js');
const auth = require('../middleware/auth.middleware');

router.get("/", authController.getMainPage);

router.post("/auth", validation.loginValidation, authController.login);

router.get("/logout", auth, authController.logout);

router.post("/reset-pass", validation.emailValidation, authController.resetPassword);

router.post("/change-pass/:id", validation.passwordValidation, authController.changePassword);

module.exports = router;
