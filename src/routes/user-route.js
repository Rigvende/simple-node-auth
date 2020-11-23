const express = require('express');
const router = express.Router(); // /users
const userController = require('../controllers/user-controller.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/", userController.findAll);

router.post("/", urlencodedParser, userController.add);

router.get("/:id", userController.findById);

router.post("/:id/edit", urlencodedParser, userController.edit);

router.post("/:id/delete", userController.delete);

module.exports = router;
