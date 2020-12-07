const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/userController.js');
const validation = require('../validation/userValidation.js');
const auth = require('../middleware/auth.middleware');
const paginateUsers = require('../middleware/pagination.middleware');

// route: '/users'

router.post("/", validation.registrationValidation, userController.create);

router.get("/", auth, paginateUsers, userController.getAll);

router.get("/:id", auth, userController.findById);

router.patch("/:id", auth, validation.updateValidation, userController.update);

router.delete("/:id", auth, userController.delete);

module.exports = router;
