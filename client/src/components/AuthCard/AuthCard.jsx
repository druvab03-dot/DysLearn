import { useLocation, useNavigate } from "react-router-dom";

import "./AuthCard.css";

import SegmentedSwitch from "../SegmentedSwitch/SegmentedSwitch";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";

function AuthCard() {

    const navigate = useNavigate();
    const location = useLocation();

    const isLogin = location.pathname === "/login";

    return (

        <div className="authCard">

            <div className="authHeader">

                <img
                    src="/favicon.png"
                    alt="DysLearn Logo"
                    className="authLogo"
                />

            </div>

            <SegmentedSwitch />

            <div className="formContainer">

                {
                    isLogin
                        ? (
                            <LoginForm
                                onLoginSuccess={() => navigate("/dashboard")}
                            />
                        )
                        : (
                            <SignupForm />
                        )
                }

            </div>

        </div>

    );

}

export default AuthCard;