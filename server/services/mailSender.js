const nodemailer = require('nodemailer')

module.exports.mailSender = async (mailOptions) => {
    const transport = nodemailer.createTransport({
        service: process.env.SMTP_SITE,
        port: 465,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    console.log("test mail")
    console.log(mailOptions)

    await transport.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log(err, "error sending mail")
        }else{
            console.log("done")
        }
    })

    // console.log(info, "info")

}