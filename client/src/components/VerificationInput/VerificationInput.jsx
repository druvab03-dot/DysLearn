import { useState } from "react";
import "./VerificationInput.css";

import Input from "../Input/Input";

function VerificationInput({
    label,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
}) {

    const [showOTP, setShowOTP] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSendOTP = () => {

        // TODO:
        // Backend API
        // Send Email / Phone OTP

        setShowOTP(true);

    };

    const handleVerifyOTP = () => {

        // TODO:
        // Verify OTP from backend

        if (otp.trim() === "") {
            alert("Enter OTP");
            return;
        }

        setVerified(true);

    };

    return (

        <div className="verificationContainer">

            <div className="verificationRow">

                <div className="verificationField">

                    <Input
                        label={label}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />

                </div>

                {!verified ? (

                    <button
                        type="button"
                        className="verifyBtn"
                        onClick={handleSendOTP}
                    >

                        {showOTP ? "Resend OTP" : "Send OTP"}

                    </button>

                ) : (

                    <button
                        type="button"
                        className="verifiedBtn"
                        disabled
                    >

                        ✓ Verified

                    </button>

                )}

            </div>

            {showOTP && !verified && (

                <div className="otpSection">

                    <Input
                        label="Verification Code"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        type="button"
                        className="verifyOTPBtn"
                        onClick={handleVerifyOTP}
                    >

                        Verify OTP

                    </button>

                </div>

            )}

        </div>

    );

}

export default VerificationInput;