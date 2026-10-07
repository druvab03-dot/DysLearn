import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AuthCard from "../../components/AuthCard/AuthCard";


function Login() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            const activeChild = localStorage.getItem("activeChild");
            navigate(activeChild ? "/dashboard" : "/parent-dashboard", {
                replace: true
            });
        }
    }, [token, navigate]);

    if (token) {
        return null;
    }

    return (

        <div className="loginPageWrapper">

            <Header />

            <main className="loginPage">

                <AuthCard />

            </main>

            <Footer />

        </div>

    );

}


export default Login;