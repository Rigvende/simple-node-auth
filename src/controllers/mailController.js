const nodemailer = require('nodemailer');
const { logger } = require('../logger');
const NODE_ENV = process.env.NODE_ENV || 'development';
const { MAIL_PASSWORD, MAIL_USER, DOMAIN, MAIL_SERVICE} = process.env;

function sendEmail(message) {
    return new Promise((res, rej) => {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        });
        
        transporter.sendMail(message, function (err, info) {
            err ? rej(err) : res(info);
        });
    });
};

exports.sendResetPasswordEmail = user => {
    const { email, name, id } = user;
    const message = {
        from: MAIL_USER,
        to: email,
        subject: 'SimpleNodeAuth - Change password',
        html: `
      <h3> Hello ${name} </h3>
      <p>Just one last step is laying ahead of you...</p>
      <p>Enter your current email and new password after following this link: 
      <a target="_" href="${DOMAIN}/change/${id}">Change password</a> </p>
      <p>Cheers,</p>
      <p>Your SimpleNodeAuth Team</p>
    `
    }
    return sendEmail(message);
};
