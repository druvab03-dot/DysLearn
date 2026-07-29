import "./SignupForm.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../Input/Input";
import Button from "../Button/Button";
import VerificationInput from "../VerificationInput/VerificationInput";

import { signup } from "../../services/authService";

function SignupForm() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const [passwordStrength, setPasswordStrength] = useState("");

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const validatePassword = (password) => {

        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/.test(
            password
        );

    };

    useEffect(() => {

        const password = formData.password;

        if (!password) {
            setPasswordStrength("");
            return;
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&^#]/.test(password)) score++;

        if (score <= 2) {
            setPasswordStrength("Weak");
        } else if (score <= 4) {
            setPasswordStrength("Medium");
        } else {
            setPasswordStrength("Strong");
        }

    }, [formData.password]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setFormError("");
        setFormSuccess("");

        if (name === "fullName" && value.trim().length < 3) {

            setErrors((prev) => ({
                ...prev,
                fullName: "Name must contain at least 3 characters.",
            }));

        }

        if (name === "email") {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (value && !emailRegex.test(value)) {

                setErrors((prev) => ({
                    ...prev,
                    email: "Enter a valid email address.",
                }));

            }

        }

        if (name === "phone") {

            const phoneRegex = /^[6-9]\d{9}$/;

            if (value && !phoneRegex.test(value)) {

                setErrors((prev) => ({
                    ...prev,
                    phone: "Enter a valid 10-digit phone number.",
                }));

            }

        }

        if (name === "password") {

            if (value && !validatePassword(value)) {

                setErrors((prev) => ({
                    ...prev,
                    password:
                        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters long.",
                }));

            }

        }

        if (name === "confirmPassword") {

            if (
                value &&
                value !==
                    (name === "confirmPassword"
                        ? formData.password
                        : formData.confirmPassword)
            ) {

                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Passwords do not match.",
                }));

            }

        }

    };

    const handleSignup = async () => {

        setFormError("");
        setFormSuccess("");

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setFormError("Please fill all required fields.");
            return;

        }

        if (formData.password !== formData.confirmPassword) {

            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Passwords do not match.",
            }));

            return;

        }

        if (!validatePassword(formData.password)) {

            setErrors((prev) => ({
                ...prev,
                password:
                    "Password does not meet the required criteria.",
            }));

            return;

        }

        try {

            setLoading(true);

            const data = await signup({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "parent",
                JSON.stringify(data.parent)
            );

            setFormSuccess("Account created successfully.");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);

        } catch (error) {

            setFormError(
                error.response?.data?.message ||
                    "Signup failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="signupForm">

            <div className="signupHeader">

                <div>

                    <h2>Create Account</h2>

                    <p>Parent</p>

                </div>

                <div className="profileUpload">

                    <div className="profileCircle">

                        Add Photo

                    </div>

                </div>

            </div>

            {formSuccess && (
                <div className="successMessage">
                    {formSuccess}
                </div>
            )}

            {formError && (
                <div className="errorMessage">
                    {formError}
                </div>
            )}

            <Input
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
            />

            <VerificationInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
            />

            <VerificationInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
            />

            {formData.password && (

                <div className="passwordStrength">

                    <span>Password Strength :</span>

                    <strong
                        className={
                            passwordStrength === "Strong"
                                ? "strong"
                                : passwordStrength === "Medium"
                                ? "medium"
                                : "weak"
                        }
                    >
                        {passwordStrength}
                    </strong>

                </div>

            )}

            <div className="passwordChecklist">

                <p
                    className={
                        formData.password.length >= 8
                            ? "valid"
                            : ""
                    }
                >
                    ✓ Minimum 8 characters
                </p>

                <p
                    className={
                        /[A-Z]/.test(formData.password)
                            ? "valid"
                            : ""
                    }
                >
                    ✓ One uppercase letter
                </p>

                <p
                    className={
                        /[a-z]/.test(formData.password)
                            ? "valid"
                            : ""
                    }
                >
                    ✓ One lowercase letter
                </p>

                <p
                    className={
                        /\d/.test(formData.password)
                            ? "valid"
                            : ""
                    }
                >
                    ✓ One number
                </p>

                <p
                    className={
                        /[@$!%*?&^#]/.test(formData.password)
                            ? "valid"
                            : ""
                    }
                >
                    ✓ One special character
                </p>

            </div>

            <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
            />

            <Button
                onClick={handleSignup}
                disabled={loading}
            >
                {loading
                    ? "Creating Account..."
                    : "Create Account"}
            </Button>

        </div>

    );

}

export default SignupForm;