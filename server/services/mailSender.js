const nodemailer = require('nodemailer')

module.exports.mailSender = async (mailOptions) => {
    const transport = nodemailer.createTransport({
        service: process.env.SMTP_SITE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const info = await transport.sendMail(mailOptions)

    console.log(info)

}