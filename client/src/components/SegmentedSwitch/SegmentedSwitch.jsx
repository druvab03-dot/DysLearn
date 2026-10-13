import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import "./SegmentedSwitch.css";


function SegmentedSwitch() {

    const navigate = useNavigate();

    const location = useLocation();

    const { t } = useTranslation();


    const active =
        location.pathname === "/signup"
            ? "signup"
            : "login";


    return (

        <div className="segment">

            <button
                type="button"
                className={
                    active === "login"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    navigate("/login")
                }
            >

                {t("auth.login")}

            </button>


            <button
                type="button"
                className={
                    active === "signup"
                        ? "active"
                        : ""
                }
                onClick={() =>
                    navigate("/signup")
                }
            >

                {t("auth.createAccount")}

            </button>

        </div>

    );

}


export default SegmentedSwitch;