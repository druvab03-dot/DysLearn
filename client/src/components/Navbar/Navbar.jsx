import "./Navbar.css";

import { useTheme } from "../../context/ThemeContext";

function Navbar(){

    const { theme, toggleTheme } = useTheme();

    return(

        <nav className="navbar">

            <img
                src="/favicon.png"
                alt="DysLearn"
                className="navLogo"
            />

            <button
                className="themeButton"
                onClick={toggleTheme}
            >

                {theme === "light" ? "🌙" : "☀️"}

            </button>

        </nav>

    );

}

export default Navbar;