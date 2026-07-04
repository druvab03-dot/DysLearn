import { useState } from "react";
import "./VerificationInput.css";

import Input from "../Input/Input";

function VerificationInput({
  label,
  placeholder,
  type = "text",
}) {

  const [showOTP, setShowOTP] = useState(false);
  const [verified, setVerified] = useState(false);

  return (

    <div className="verificationContainer">

      {/* Main Input */}

      <div className="verificationRow">

        <div className="verificationField">

          <Input
            label={label}
            type={type}
            placeholder={placeholder}
          />

        </div>

        {!verified ? (

          <button
            className="verifyBtn"
            onClick={() => setShowOTP(true)}
          >

            {showOTP ? "Resend" : "Send OTP"}

          </button>

        ) : (

          <button
            className="verifiedBtn"
            disabled
          >

            Verified

          </button>

        )}

      </div>

      {/* OTP */}

      {showOTP && !verified && (

        <div className="otpSection">

          <Input
            label="Enter Verification Code"
            placeholder="Enter OTP"
          />

          <button
            className="verifyOTPBtn"
            onClick={() => setVerified(true)}
          >

            Verify

          </button>

        </div>

      )}

    </div>

  );

}

export default VerificationInput;