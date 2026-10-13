import {
    useEffect,
    useRef,
    useState
} from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

    try {

        parent = storedParent
            ? JSON.parse(storedParent)
            : null;

    } catch {

        parent = null;

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
    // LOGO
    // ==========================================

    const handleLogoClick = () => {

        navigate(
            token
                ? "/dashboard"
                : "/"
        );

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