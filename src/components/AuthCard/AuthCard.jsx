import { useState } from "react";

import "./AuthCard.css";

import SegmentedSwitch from "../SegmentedSwitch/SegmentedSwitch";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";

function AuthCard() {

    const [active, setActive] = useState("login");

    return (

        <div className="authCard">

            <div className="authHeader">

               <img
                 src="/favicon.png"
                 alt="DysLearn Logo"
                className="authLogo"
                />

            </div>

            <SegmentedSwitch
                active={active}
                setActive={setActive}
            />

            <div className="formContainer">

                {
                    active === "login"
                    ? <LoginForm />
                    : <SignupForm />
                }

            </div>

        </div>

    );

}

export default AuthCard;