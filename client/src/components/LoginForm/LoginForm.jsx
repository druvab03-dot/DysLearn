import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./LoginForm.css";

import Input from "../Input/Input";
import Button from "../Button/Button";

import {
    login,
    sendLoginOTP,
    verifyLoginOTP,
    sendForgotPasswordOTP,
    resetPassword
} from "../../services/authService";


function LoginForm() {

    const navigate = useNavigate();

    const { t } = useTranslation();


    const [mode, setMode] =
        useState("login");

    // login | otp | forgot | reset

    const [loading, setLoading] =
        useState(false);

    const [otpSent, setOtpSent] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const [formData, setFormData] =
        useState({

            identifier: "",

            password: "",

            otp: "",

            newPassword: "",

            confirmPassword: ""

        });


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });


        setError("");

        setSuccess("");

    };


    const saveLogin = (data) => {

        localStorage.setItem(
            "token",
            data.token
        );


        localStorage.setItem(
            "parent",
            JSON.stringify(data.parent)
        );


        navigate(
            "/parent-dashboard",
            {
               replace: true
            }
        );

    };


    // ==========================================
    // PASSWORD LOGIN
    // ==========================================

    const handleLogin = async () => {

        try {

            setLoading(true);


            const data = await login({

                identifier:
                    formData.identifier,

                password:
                    formData.password

            });


            saveLogin(data);


        } catch (error) {

            setError(
                error.response?.data?.message ||
                t("auth.loginFailed")
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // SEND LOGIN OTP
    // ==========================================

    const handleSendLoginOTP =
        async () => {

            try {

                setLoading(true);


                await sendLoginOTP(
                    formData.identifier
                );


                setOtpSent(true);

                setSuccess(
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


    // ==========================================
    // VERIFY LOGIN OTP
    // ==========================================

    const handleVerifyLoginOTP =
        async () => {

            try {

                setLoading(true);


                const data =
                    await verifyLoginOTP({

                        identifier:
                            formData.identifier,

                        otp:
                            formData.otp

                    });


                saveLogin(data);


            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    t("auth.invalidOTP")
                );


            } finally {

                setLoading(false);

            }

        };


    // ==========================================
    // FORGOT PASSWORD OTP
    // ==========================================

    const handleForgotOTP =
        async () => {

            try {

                setLoading(true);


                await sendForgotPasswordOTP(
                    formData.identifier
                );


                setOtpSent(true);

                setMode("reset");

                setSuccess(
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


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword =
        async () => {

            if (
                formData.newPassword !==
                formData.confirmPassword
            ) {

                setError(
                    t("auth.passwordsDoNotMatch")
                );

                return;

            }


            try {

                setLoading(true);


                await resetPassword({

                    identifier:
                        formData.identifier,

                    otp:
                        formData.otp,

                    newPassword:
                        formData.newPassword

                });


                setSuccess(
                    t("auth.passwordUpdated")
                );


                setTimeout(() => {

                    setMode("login");

                    setOtpSent(false);


                    setFormData({

                        identifier: "",

                        password: "",

                        otp: "",

                        newPassword: "",

                        confirmPassword: ""

                    });

                }, 1500);


            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    t("auth.resetFailed")
                );


            } finally {

                setLoading(false);

            }

        };


    return (

        <div className="loginForm">

            {error && (

                <div className="errorMessage">
                    {error}
                </div>

            )}


            {success && (

                <div className="successMessage">
                    {success}
                </div>

            )}


            <Input
                label={
                    t("auth.emailOrPhone")
                }
                name="identifier"
                placeholder={
                    t("auth.enterEmailOrPhone")
                }
                value={
                    formData.identifier
                }
                onChange={handleChange}
            />


            {mode === "login" && (

                <>

                    <Input
                        label={
                            t("auth.password")
                        }
                        name="password"
                        type="password"
                        placeholder={
                            t("auth.enterPassword")
                        }
                        value={
                            formData.password
                        }
                        onChange={handleChange}
                    />


                    <button
                        className="otpButton"
                        type="button"
                        onClick={() =>
                            setMode("otp")
                        }
                    >

                        {t("auth.loginWithOTP")}

                    </button>


                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                    >

                        {
                            loading
                                ? t("auth.loggingIn")
                                : t("auth.login")
                        }

                    </Button>


                    <button
                        className="textButton"
                        type="button"
                        onClick={() => {

                            setMode("forgot");

                            setOtpSent(false);

                        }}
                    >

                        {t("auth.forgotPassword")}

                    </button>

                </>

            )}


            {mode === "otp" && (

                <>

                    {otpSent && (

                        <Input
                            label={
                                t("auth.enterOTP")
                            }
                            name="otp"
                            placeholder={
                                t("auth.otpPlaceholder")
                            }
                            value={
                                formData.otp
                            }
                            onChange={
                                handleChange
                            }
                        />

                    )}


                    {!otpSent ? (

                        <Button
                            onClick={
                                handleSendLoginOTP
                            }
                            disabled={loading}
                        >

                            {
                                loading
                                    ? t("auth.pleaseWait")
                                    : t("auth.sendOTP")
                            }

                        </Button>

                    ) : (

                        <Button
                            onClick={
                                handleVerifyLoginOTP
                            }
                            disabled={loading}
                        >

                            {
                                loading
                                    ? t("auth.verifying")
                                    : t("auth.verifyOTP")
                            }

                        </Button>

                    )}


                    <button
                        className="textButton"
                        type="button"
                        onClick={() => {

                            setMode("login");

                            setOtpSent(false);

                        }}
                    >

                        {
                            t(
                                "auth.backToPasswordLogin"
                            )
                        }

                    </button>

                </>

            )}


            {mode === "forgot" && (

                <>

                    <Button
                        onClick={
                            handleForgotOTP
                        }
                        disabled={loading}
                    >

                        {
                            loading
                                ? t("auth.pleaseWait")
                                : t("auth.sendResetOTP")
                        }

                    </Button>


                    <button
                        className="textButton"
                        type="button"
                        onClick={() =>
                            setMode("login")
                        }
                    >

                        {t("auth.backToLogin")}

                    </button>

                </>

            )}


            {mode === "reset" && (

                <>

                    <Input
                        label={
                            t("auth.enterOTP")
                        }
                        name="otp"
                        placeholder={
                            t("auth.otpPlaceholder")
                        }
                        value={
                            formData.otp
                        }
                        onChange={handleChange}
                    />


                    <Input
                        label={
                            t("auth.newPassword")
                        }
                        name="newPassword"
                        type="password"
                        placeholder={
                            t(
                                "auth.newPasswordPlaceholder"
                            )
                        }
                        value={
                            formData.newPassword
                        }
                        onChange={handleChange}
                    />


                    <Input
                        label={
                            t(
                                "auth.confirmPassword"
                            )
                        }
                        name="confirmPassword"
                        type="password"
                        placeholder={
                            t(
                                "auth.confirmPasswordPlaceholder"
                            )
                        }
                        value={
                            formData.confirmPassword
                        }
                        onChange={handleChange}
                    />


                    <Button
                        onClick={
                            handleResetPassword
                        }
                        disabled={loading}
                    >

                        {
                            loading
                                ? t("auth.pleaseWait")
                                : t("auth.resetPassword")
                        }

                    </Button>

                </>

            )}

        </div>

    );

}


export default LoginForm;