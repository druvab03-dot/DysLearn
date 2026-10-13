const sendOTPSMS = async (
    phone,
    otp,
    purpose = "verification"
) => {

    const apiKey = process.env.TEXTBEE_API_KEY;
    const deviceId = process.env.TEXTBEE_DEVICE_ID;


    if (!apiKey || !deviceId) {

        throw new Error(
            "TextBee SMS configuration is missing"
        );

    }


    // Convert Indian 10-digit number to international format
    let recipient = phone.trim();

    if (/^[0-9]{10}$/.test(recipient)) {

        recipient = `+91${recipient}`;

    }


    const purposeText =
        purpose === "login"
            ? "login"
            : purpose === "forgot-password"
            ? "password reset"
            : "verification";


    const message =
        `Your DysLearn ${purposeText} OTP is ${otp}. ` +
        `It is valid for 5 minutes. Do not share this OTP.`;


    const response = await fetch(

        `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "x-api-key": apiKey

            },

            body: JSON.stringify({

                recipients: [
                    recipient
                ],

                message

            })

        }

    );


    const data = await response.json();


    if (!response.ok) {

        console.error(
            "TextBee Error:",
            data
        );

        throw new Error(
            data?.message ||
            "Unable to send SMS OTP"
        );

    }


    return data;

};


module.exports = {
    sendOTPSMS
};