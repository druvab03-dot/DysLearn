import {
    useNavigate
} from "react-router-dom";

import "./Landing.css";

import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";


function Landing() {

    const navigate =
        useNavigate();

    const handleStart = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const activeChild = localStorage.getItem("activeChild");
            navigate(activeChild ? "/dashboard" : "/parent-dashboard");
        } else {
            navigate("/login");
        }
    };


    return (

        <div className="landing">

            <Header />


            <Hero
                onStart={handleStart}
            />


            <Features />


            <Footer />

        </div>

    );

}


export default Landing;