import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginForm.css";

import Input from "../Input/Input";
import Button from "../Button/Button";

import { login } from "../../services/authService";

function LoginForm() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formError, setFormError] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [rememberMe, setRememberMe] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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

        if (name === "password") {

            if (value && value.length < 8) {

                setErrors((prev) => ({
                    ...prev,
                    password:
                        "Password must contain at least 8 characters.",
                }));

            }

        }

    };

    const handleLogin = async () => {

        setFormError("");

        if (!formData.email || !formData.password) {

            setFormError("Please fill all required fields.");

            return;

        }

        if (errors.email || errors.password) {

            return;

        }

        try {

            setLoading(true);

            const data = await login({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (rememberMe) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "parent",
                    JSON.stringify(data.parent)
                );

            } else {

                sessionStorage.setItem(
                    "token",
                    data.token
                );

                sessionStorage.setItem(
                    "parent",
                    JSON.stringify(data.parent)
                );

            }

            navigate("/dashboard");

        } catch (error) {

            setFormError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }

    };
    return (

        <div className="loginForm">

            {formError && (
                <div className="errorMessage">
                    {formError}
                </div>
            )}

            <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
            />

            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="current-password"
            />

            <button
                type="button"
                className="otpButton"
            >
                Login with OTP instead
            </button>

            <Button
                onClick={handleLogin}
                disabled={loading}
            >
                {loading
                    ? "Logging In..."
                    : "Login"}
            </Button>

            <div className="loginFooter">

                <label className="rememberMe">

                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                            setRememberMe(
                                e.target.checked
                            )
                        }
                    />

                    <span>Remember Me</span>

                </label>

                <button
                    type="button"
                    className="textButton"
                >
                    Forgot Password?
                </button>

            </div>

        </div>

    );

}

export default LoginForm;