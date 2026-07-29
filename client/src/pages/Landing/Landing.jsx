import { useNavigate } from "react-router-dom";

import "./Landing.css";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";

function Landing() {

    const navigate = useNavigate();

    return (

        <div className="landing">

            <Navbar />

            <Hero
                onStart={() => navigate("/login")}
            />

            <Features />

            <Footer />

        </div>

    );

}

export default Landing;