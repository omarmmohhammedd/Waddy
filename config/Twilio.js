const client = require("twilio")(process.env.ACCOUNT_SID, process.env.TWILO_TOKEN);
const sendOTPTwilio =async (phone) => {
    const Sender = await client.verify.v2
        .services(process.env.TWILO_VERIFY_SID)
        .verifications.create({ to: `+2${phone}`, channel: "sms" })
    return Sender.status === "pending" ?true : false
}

const verfiyTwilioOTP = async (otp,phone) => {
    const verification = await client.verify.v2
        .services(process.env.TWILO_VERIFY_SID)
        .verificationChecks.create({ to: `+2${phone}`, code: otp })
    return verification.status === "approved" ?true : false
}
module.exports = { sendOTPTwilio, verfiyTwilioOTP };