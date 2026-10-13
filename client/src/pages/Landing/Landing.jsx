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


    return (

        <div className="landing">

            <Header />


            <Hero
                onStart={() =>
                    navigate("/login")
                }
            />


            <Features />


            <Footer />

        </div>

    );

}


export default Landing;