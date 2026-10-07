const { sendOTPEmail } = require("./emailService");
const { sendOTPSMS } = require("./smsService");

// Check email
const isEmail = (identifier) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
};

// Check Indian phone number
const isPhone = (identifier) => {
    return /^[0-9]{10}$/.test(identifier);
};

// Send OTP
const sendOTP = async (identifier, otp, purpose = "verification") => {
    console.log(
        `\n========================================\n` +
        `[DysLearn OTP Verification]\n` +
        `Recipient: ${identifier}\n` +
        `Code:      ${otp}\n` +
        `Purpose:   ${purpose}\n` +
        `========================================\n`
    );

    // EMAIL
    if (isEmail(identifier)) {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendOTPEmail(identifier, otp, purpose);
                return { success: true, channel: "email" };
            } catch (err) {
                console.warn("⚠️ Failed to send real email via nodemailer:", err.message);
            }
        } else {
            console.log("ℹ️ EMAIL_USER / EMAIL_PASS not set. Using dev OTP logged above.");
        }
        return { success: true, channel: "email", devOtp: otp };
    }

    // PHONE
    if (isPhone(identifier)) {
        if (process.env.TEXTBEE_API_KEY && process.env.TEXTBEE_DEVICE_ID) {
            try {
                await sendOTPSMS(identifier, otp, purpose);
                return { success: true, channel: "sms" };
            } catch (err) {
                console.warn("⚠️ Failed to send real SMS via TextBee:", err.message);
            }
        } else {
            console.log("ℹ️ TEXTBEE_API_KEY / TEXTBEE_DEVICE_ID not set. Using dev OTP logged above.");
        }
        return { success: true, channel: "sms", devOtp: otp };
    }

    throw new Error("Enter a valid email or 10-digit phone number");
};

module.exports = {
    sendOTP,
    isEmail,
    isPhone,
};
