import "./SignupForm.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Input from "../Input/Input";
import Button from "../Button/Button";
import VerificationInput from "../VerificationInput/VerificationInput";

import { signup } from "../../services/authService";


function SignupForm() {

    const navigate = useNavigate();

    const { t } = useTranslation();


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [emailVerified, setEmailVerified] =
        useState(false);

    const [phoneVerified, setPhoneVerified] =
        useState(false);


    const [formData, setFormData] =
        useState({

            fullName: "",

            email: "",

            phone: "",

            password: "",

            confirmPassword: ""

        });


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

        setError("");

    };


    const validatePassword = (password) => {

        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

        return regex.test(password);

    };


    const handleSignup = async () => {

        setError("");


        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                t("auth.fillAllFields")
            );

            return;

        }


        if (!emailVerified) {

            setError(
                t("auth.verifyEmail")
            );

            return;

        }


        if (!phoneVerified) {

            setError(
                t("auth.verifyPhone")
            );

            return;

        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                t("auth.passwordsDoNotMatch")
            );

            return;

        }


        if (
            !validatePassword(
                formData.password
            )
        ) {

            setError(
                t("auth.passwordRequirements")
            );

            return;

        }


        try {

            setLoading(true);


            const data =
                await signup({

                    fullName:
                        formData.fullName,

                    email:
                        formData.email.trim(),

                    phone:
                        formData.phone.trim(),

                    password:
                        formData.password

                });


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


        } catch (error) {

            setError(
                error.response?.data?.message ||
                t("auth.signupFailed")
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="signupForm">

            <div className="signupHeader">

                <div>

                    <h2>
                        {t("auth.createAccount")}
                    </h2>

                    <p>
                        {t("auth.parent")}
                    </p>

                </div>


                <div className="profileUpload">

                    <div className="profileCircle">

                        {t("auth.addPhoto")}

                    </div>

                </div>

            </div>


            {error && (

                <div className="errorMessage">
                    {error}
                </div>

            )}


            <Input
                label={
                    t("auth.fullName")
                }
                name="fullName"
                placeholder={
                    t("auth.enterFullName")
                }
                value={
                    formData.fullName
                }
                onChange={handleChange}
            />


            <VerificationInput
                label={
                    t("auth.email")
                }
                name="email"
                type="email"
                placeholder={
                    t("auth.enterEmail")
                }
                value={
                    formData.email
                }
                onChange={handleChange}
                verificationType="email"
                onVerified={
                    setEmailVerified
                }
            />


            <VerificationInput
                label={
                    t("auth.phoneNumber")
                }
                name="phone"
                type="tel"
                placeholder={
                    t("auth.enterPhoneNumber")
                }
                value={
                    formData.phone
                }
                onChange={handleChange}
                verificationType="phone"
                onVerified={
                    setPhoneVerified
                }
            />


            <Input
                label={
                    t("auth.password")
                }
                name="password"
                type="password"
                placeholder={
                    t("auth.createPassword")
                }
                value={
                    formData.password
                }
                onChange={handleChange}
            />


            <Input
                label={
                    t("auth.confirmPassword")
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
                onClick={handleSignup}
                disabled={loading}
            >

                {
                    loading
                        ? t(
                            "auth.creatingAccount"
                        )
                        : t(
                            "auth.createAccount"
                        )
                }

            </Button>

        </div>

    );

}


export default SignupForm;