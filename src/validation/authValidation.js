const { EMAIL_CHECK, PASSWORD_CHECK } = require('./validationChecks.js');

exports.loginValidation = [EMAIL_CHECK, PASSWORD_CHECK];

exports.passwordValidation = [PASSWORD_CHECK];

exports.emailValidation = [EMAIL_CHECK];
