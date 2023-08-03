const nodemailer = require('nodemailer');

async function SendMail ({ from, to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTO_PORT,
        secure: false,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
                    from: `Share-e-dil <${from}>`,
                    to: to,
                    subject: subject,
                    text: text,
                    html: html
    });
}

module.exports = SendMail;