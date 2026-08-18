const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendOTPEmail = async (email, otp, purpose = "verification") => {

    const purposeText =
        purpose === "login"
            ? "Login"
            : purpose === "forgot-password"
            ? "Password Reset"
            : "Verification";


    const mailOptions = {

        from: `"DysLearn" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: `DysLearn ${purposeText} OTP`,

        text: `
Your DysLearn ${purposeText} OTP is:

${otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

DysLearn
        `,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 30px;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
            ">

                <h2 style="margin-bottom: 10px;">
                    DysLearn
                </h2>

                <p>
                    Your ${purposeText} verification code is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    margin: 25px 0;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP is valid for <strong>5 minutes</strong>.
                </p>

                <p style="
                    font-size: 13px;
                    color: #6b7280;
                    margin-top: 30px;
                ">
                    Do not share this OTP with anyone.
                </p>

            </div>
        `,
    };


    await transporter.sendMail(mailOptions);

};


module.exports = {
    sendOTPEmail,
};