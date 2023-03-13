const mailer = require("nodemailer")
const { VsAuthenticator } = require('@vs-org/authenticator')
require("dotenv").config()
const sendOTP = async (email) => {
    const secret = VsAuthenticator.generateTOTP(process.env.OTP_SECERT)
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: `${email}`,
        subject: 'Sending OTP Recovery Password ',
        text: `Your OTP Password is ${secret}  Valid For 60 min`
    };
    console.log(secret)
    return await transporter.sendMail(mailOptions)

}

const verifyOTP = async (OTP) => VsAuthenticator.verifyTOTP(OTP, process.env.OTP_SECERT, 120)

module.exports = { sendOTP, verifyOTP }