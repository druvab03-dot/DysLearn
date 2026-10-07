import {
    useEffect,
    useRef,
    useState
} from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import "./Header.css";

import { useTheme } from "../../context/ThemeContext";


function Header() {

    const navigate = useNavigate();

    const { theme, toggleTheme } =
        useTheme();

    const { t, i18n } =
        useTranslation();


    const [languageOpen, setLanguageOpen] =
        useState(false);

    const [profileOpen, setProfileOpen] =
        useState(false);

    const [showFloatingHeader, setShowFloatingHeader] =
        useState(false);


    const languageRef = useRef(null);
    const profileRef = useRef(null);


    const token =
        localStorage.getItem("token");

    const storedParent =
        localStorage.getItem("parent");


    let parent = null;
    if (storedParent) {
        try {
            parent = JSON.parse(storedParent);
        } catch {
            parent = null;
        }
    }


    const parentName =
        parent?.fullName || "Parent";

    const parentEmail =
        parent?.email || "";

    const profileLetter =
        parentName.charAt(0).toUpperCase();


    // ==========================================
    // OUTSIDE CLICK
    // ==========================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                languageRef.current &&
                !languageRef.current.contains(event.target)
            ) {

                setLanguageOpen(false);

            }


            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {

                setProfileOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // ==========================================
    // SCROLL REVEAL HEADER
    // ==========================================

    useEffect(() => {

        const handleScroll = () => {

            const scrollPosition =
                window.scrollY;


            if (scrollPosition > 80) {

                setShowFloatingHeader(true);

            } else {

                setShowFloatingHeader(false);

            }

        };


        handleScroll();


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        return () => {

            window.removeEventListener(
                "scroll",
                handleScroll
            );

        };

    }, []);


    // ==========================================
    // LANGUAGE
    // ==========================================

    const changeLanguage = async (language) => {

        await i18n.changeLanguage(
            language
        );

        setLanguageOpen(false);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("parent");


        setProfileOpen(false);


        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // ==========================================
    // BACK NAVIGATION & LOGO
    // ==========================================

    const location = useLocation();

    const canGoBack = (() => {
        // Landing page never has back navigation
        if (location.pathname === "/") {
            return false;
        }

        // On parent-dashboard (the parent root screen):
        // Only show if user arrived here from an inner page (e.g. child dashboard or class)
        if (location.pathname === "/parent-dashboard") {
            return Boolean(window.history.state && window.history.state.idx > 0);
        }

        // All inner sub-routes (/class/*, /dashboard, /login, /signup) can navigate back
        return true;
    })();

    const handleBack = () => {
        const path = location.pathname;

        if (path.includes("/english")) {
            const parts = path.split("/");
            const classNum = parts[2];
            navigate(`/class/${classNum}`);
        } else if (path.startsWith("/class/")) {
            navigate("/dashboard");
        } else if (path === "/dashboard") {
            navigate("/parent-dashboard");
        } else if (path === "/login" || path === "/signup") {
            navigate("/");
        } else if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            const hasToken = Boolean(localStorage.getItem("token"));
            navigate(hasToken ? "/parent-dashboard" : "/");
        }
    };

    const handleLogoClick = () => {
        if (!token) {
            navigate("/");
            return;
        }
        const activeChild = localStorage.getItem("activeChild");
        navigate(activeChild ? "/dashboard" : "/parent-dashboard");
    };


return (

    <div className="headerSlot">

        <header
            className={
                `globalHeader ${
                    showFloatingHeader
                        ? "floatingHeader"
                        : ""
                }`
            }
        >

            <div className="headerInner">

                <div className="headerLeftGroup">

                    {canGoBack && (
                        <button
                            type="button"
                            className="headerBackButton"
                            onClick={handleBack}
                            aria-label={t("global.back", "Back")}
                            title={t("global.back", "Back")}
                            id="headerBackBtn"
                        >
                            <ArrowLeft size={18} />
                            <span className="backText">
                                {t("global.back", "Back")}
                            </span>
                        </button>
                    )}

                    {/* BRAND */}
                    <button
                        type="button"
                        className="headerBrand"
                        onClick={handleLogoClick}
                    >
                        <img
                            src="/favicon.png"
                            alt=""
                            className="headerLogo"
                        />
                        <span>
                            DysLearn
                        </span>
                    </button>

                </div>


                <div className="headerActions">


                    {/* LANGUAGE */}

                    <div
                        className="headerDropdown"
                        ref={languageRef}
                    >

                        <button
                            type="button"
                            className="headerControl languageControl"
                            onClick={() => {

                                setLanguageOpen(
                                    !languageOpen
                                );

                                setProfileOpen(false);

                            }}
                            aria-label="Change language"
                        >

                            <span className="globeIcon">
                                🌐
                            </span>

                            <span className="dropdownArrow">
                                ▾
                            </span>

                        </button>


                        {languageOpen && (

                            <div className="headerMenu languageMenu">

                                <button
                                    type="button"
                                    className={
                                        i18n.language === "en"
                                            ? "menuOption active"
                                            : "menuOption"
                                    }
                                    onClick={() =>
                                        changeLanguage("en")
                                    }
                                >

                                    English

                                </button>


                                <button
                                    type="button"
                                    className={
                                        i18n.language === "kn"
                                            ? "menuOption active"
                                            : "menuOption"
                                    }
                                    onClick={() =>
                                        changeLanguage("kn")
                                    }
                                >

                                    ಕನ್ನಡ

                                </button>


                                <button
                                    type="button"
                                    className={
                                        i18n.language === "hi"
                                            ? "menuOption active"
                                            : "menuOption"
                                    }
                                    onClick={() =>
                                        changeLanguage("hi")
                                    }
                                >

                                    हिन्दी

                                </button>

                            </div>

                        )}

                    </div>


                    {/* THEME */}

                    <button
                        type="button"
                        className="headerControl themeControl"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >

                        {
                            theme === "light"
                                ? "🌙"
                                : "☀️"
                        }

                    </button>


                    {/* PROFILE */}

                    {token && (

                        <div
                            className="headerDropdown"
                            ref={profileRef}
                        >

                            <button
                                type="button"
                                className="profileControl"
                                onClick={() => {

                                    setProfileOpen(
                                        !profileOpen
                                    );

                                    setLanguageOpen(false);

                                }}
                            >

                                <div className="headerAvatar">

                                    {profileLetter}

                                </div>


                                <span className="headerParentName">

                                    {parentName}

                                </span>


                                <span className="dropdownArrow">
                                    ▾
                                </span>

                            </button>


                            {profileOpen && (

                                <div className="headerMenu profileMenu">

                                    <div className="profileSummary">

                                        <strong>
                                            {parentName}
                                        </strong>

                                        {parentEmail && (

                                            <span>
                                                {parentEmail}
                                            </span>

                                        )}

                                    </div>


                                    <div className="menuDivider" />


                                    <button
                                        type="button"
                                        className="menuOption"
                                    >

                                        {t("global.profile")}

                                    </button>


                                   <button
                                        type="button"
                                        className="menuOption"
                                        onClick={() => {

                                        setProfileOpen(false);

                                        navigate(
                                        "/parent-dashboard"
                                        );

                                        }}
                                    >

                                        {t("global.parentDashboard")}

                                    </button>


                                    <div className="menuDivider" />


                                    <button
                                        type="button"
                                        className="menuOption logoutOption"
                                        onClick={handleLogout}
                                    >

                                        {t("global.logout")}

                                    </button>

                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

        </header>
          
    </div>

    );

}


export default Header;