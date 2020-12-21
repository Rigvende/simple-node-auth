const nodemailer = require('nodemailer');
const NODE_ENV = process.env.NODE_ENV || 'development';
const { MAIL_PASSWORD, MAIL_USER, DOMAIN, MAIL_SERVICE} = process.env;

function sendEmail(message) {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: MAIL_SERVICE,
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
    console.log(user);
    const email = NODE_ENV === 'production' ? user.email : MAIL_USER;
    const message = {
        from: MAIL_USER,
        to: email,
        subject: 'SimpleNodeAuth - Change password',
        html: `
      <h3> Hello ${user.name} </h3>
      <p>Just one last step is laying ahead of you...</p>
      <p>Enter your current email and new password after following this link: 
      <a target="_" href="${DOMAIN}/change/${user.id}">Change password</a> </p>
      <p>Cheers,</p>
      <p>Your SimpleNodeAuth Team</p>
    `
    }
    return sendEmail(message);
};
