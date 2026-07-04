import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState("light");

    useEffect(() => {

        document.body.setAttribute("data-theme", theme);

    }, [theme]);

    const toggleTheme = () => {

        setTheme(prev => prev === "light" ? "dark" : "light");

    };

    return (

        <ThemeContext.Provider
            value={{ theme, toggleTheme }}
        >

            {children}

        </ThemeContext.Provider>

    );

}

export function useTheme(){

    return useContext(ThemeContext);

}