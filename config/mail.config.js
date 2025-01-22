const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    secure: process.env.MAIL_SECURE === 'true',
    tls: {
        rejectUnauthorized: false
    },
});

module.exports = transporter;