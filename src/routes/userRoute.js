const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/userController.js');
const validation = require('../validation/userValidation.js');

// route: '/users'

router.get("/", userController.getAll);

router.post("/", validation.registrationValidation, userController.create);

router.get("/:id", userController.findById);

router.patch("/:id", validation.updateValidation, userController.update);

router.delete("/:id", userController.delete);

module.exports = router;
