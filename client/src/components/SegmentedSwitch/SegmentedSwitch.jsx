import { useLocation, useNavigate } from "react-router-dom";

import "./SegmentedSwitch.css";

function SegmentedSwitch() {

    const navigate = useNavigate();
    const location = useLocation();

    const active =
        location.pathname === "/signup"
            ? "signup"
            : "login";

    return (

        <div className="segment">

            <button
                className={active === "login" ? "active" : ""}
                onClick={() => navigate("/login")}
            >
                Login
            </button>

            <button
                className={active === "signup" ? "active" : ""}
                onClick={() => navigate("/signup")}
            >
                Create Account
            </button>

        </div>

    );

}

export default SegmentedSwitch;