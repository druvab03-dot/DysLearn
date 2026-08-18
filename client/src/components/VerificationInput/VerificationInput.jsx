import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./VerificationInput.css";

import Input from "../Input/Input";

import {
    sendSignupOTP,
    verifySignupOTP
} from "../../services/authService";


function VerificationInput({
    label,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
    verificationType,
    onVerified
}) {

    const { t } = useTranslation();


    const [showOTP, setShowOTP] =
        useState(false);

    const [verified, setVerified] =
        useState(false);

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    const handleSendOTP = async () => {

        if (!value?.trim()) {

            setError(
                verificationType === "email"
                    ? t("auth.enterEmailFirst")
                    : t("auth.enterPhoneFirst")
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setMessage("");


            const data =
                await sendSignupOTP(
                    value.trim(),
                    verificationType
                );


            setShowOTP(true);


            setMessage(
                data.message ||
                t("auth.otpSent")
            );


        } catch (error) {

            setError(
                error.response?.data?.message ||
                t("auth.unableToSendOTP")
            );


        } finally {

            setLoading(false);

        }

    };


    const handleVerifyOTP = async () => {

        if (!otp.trim()) {

            setError(
                t("auth.enterOTPError")
            );

            return;

        }


        try {

            setLoading(true);

            setError("");

            setMessage("");


            const data =
                await verifySignupOTP(
                    value.trim(),
                    otp.trim(),
                    verificationType
                );


            setVerified(true);

            setShowOTP(false);


            setMessage(
                data.message ||
                t("auth.verifiedSuccessfully")
            );


            if (onVerified) {
                onVerified(true);
            }


        } catch (error) {

            setError(
                error.response?.data?.message ||
                t("auth.invalidOTP")
            );


        } finally {

            setLoading(false);

        }

    };


    const handleMainInputChange = (e) => {

        if (verified) {

            setVerified(false);

            if (onVerified) {
                onVerified(false);
            }

        }


        setShowOTP(false);

        setOtp("");

        setError("");

        setMessage("");

        onChange(e);

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
                        onChange={
                            handleMainInputChange
                        }
                        disabled={loading}
                    />

                </div>


                {!verified ? (

                    <button
                        type="button"
                        className="verifyBtn"
                        onClick={handleSendOTP}
                        disabled={loading}
                    >

                        {
                            loading
                                ? t("auth.pleaseWait")
                                : showOTP
                                    ? t("auth.resendOTP")
                                    : t("auth.sendOTP")
                        }

                    </button>

                ) : (

                    <button
                        type="button"
                        className="verifiedBtn"
                        disabled
                    >

                        {t("auth.verified")}

                    </button>

                )}

            </div>


            {showOTP && !verified && (

                <div className="otpSection">

                    <Input
                        label={
                            t("auth.verificationCode")
                        }
                        name={`${name}OTP`}
                        placeholder={
                            t("auth.otpPlaceholder")
                        }
                        value={otp}
                        onChange={(e) => {

                            setOtp(e.target.value);

                            setError("");

                        }}
                    />


                    <button
                        type="button"
                        className="verifyOTPBtn"
                        onClick={handleVerifyOTP}
                        disabled={loading}
                    >

                        {
                            loading
                                ? t("auth.verifying")
                                : t("auth.verifyOTP")
                        }

                    </button>

                </div>

            )}


            {error && (

                <p className="verificationError">
                    {error}
                </p>

            )}


            {message && (

                <p className="verificationSuccess">
                    {message}
                </p>

            )}

        </div>

    );

}


export default VerificationInput;