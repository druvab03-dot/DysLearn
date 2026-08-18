import "./Input.css";

import { useState } from "react";
import { useTranslation } from "react-i18next";


function Input({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error = "",
    required = false,
    disabled = false,
    autoComplete = "off",
}) {

    const { t } = useTranslation();

    const [showPassword, setShowPassword] =
        useState(false);

    const isPassword =
        type === "password";


    return (

        <div className="inputGroup">

            {label && (

                <label htmlFor={name}>

                    {label}

                    {required && (
                        <span className="requiredMark">
                            *
                        </span>
                    )}

                </label>

            )}


            <div
                className={`inputWrapper ${
                    error ? "inputError" : ""
                }`}
            >

                <input
                    id={name}
                    name={name}
                    type={
                        isPassword
                            ? showPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete={autoComplete}
                />


                {isPassword && (

                    <button
                        type="button"
                        className="togglePassword"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                    >

                        {
                            showPassword
                                ? t("auth.hide")
                                : t("auth.show")
                        }

                    </button>

                )}

            </div>


            {error && (

                <p className="inputErrorText">
                    {error}
                </p>

            )}

        </div>

    );

}


export default Input;