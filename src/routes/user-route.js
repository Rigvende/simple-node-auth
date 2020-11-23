const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/user-controller.js');

// '/users' route

router.get("/", userController.findAll);

router.post("/", userController.add);

router.get("/:id", userController.findById);

router.post("/:id/edit", userController.edit);

router.post("/:id/delete", userController.delete);

module.exports = router;
