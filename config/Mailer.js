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

const OrderSummery = async (order) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: `${order.receivedEmail}`,
        subject: 'Order Summey',
        html: `<div style="font-family:tahoma;">
                <h3>Dear : ${order.receivedName}</h3>
                <h4>You Have New Order 😁</h4> 
                <h5>Will Sent You at : ${order.deliverTime}</h5>
                <h5> You Will Receive The Order in This Location ${order.receivedAddress} <h5/>  
                <h5>Your Track ID is ${order.trackId} You Can Track Your Order With it In Waddy App</h5>
                </div> `
    };
    return await transporter.sendMail(mailOptions)
}

module.exports = { sendOTP, verifyOTP, OrderSummery }