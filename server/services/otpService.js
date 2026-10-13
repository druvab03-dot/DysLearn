const {
    sendOTPEmail
} = require("./emailService");

const {
    sendOTPSMS
} = require("./smsService");


// Check email
const isEmail = (identifier) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        identifier
    );

};


// Check Indian phone number
const isPhone = (identifier) => {

    return /^[0-9]{10}$/.test(
        identifier
    );

};


// Send OTP
const sendOTP = async (
    identifier,
    otp,
    purpose = "verification"
) => {


    // EMAIL
    if (isEmail(identifier)) {

        await sendOTPEmail(
            identifier,
            otp,
            purpose
        );


        return {

            success: true,

            channel: "email"

        };

    }



    // PHONE
    if (isPhone(identifier)) {

        await sendOTPSMS(
            identifier,
            otp,
            purpose
        );


        return {

            success: true,

            channel: "sms"

        };

    }



    throw new Error(
        "Enter a valid email or 10-digit phone number"
    );

};


module.exports = {

    sendOTP,

    isEmail,

    isPhone

};