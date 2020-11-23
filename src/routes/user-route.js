const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/user-controller.js');
const {registerChecks, editChecks} = require('../validation.js');

// route: '/users'

router.get("/", userController.findAll);

router.post("/", registerChecks, userController.add);

router.get("/:id", userController.findById);

router.post("/:id/edit", editChecks, userController.edit);

router.get("/:id/delete", userController.delete);

module.exports = router;
