import "./Landing.css";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Footer from "../../components/Footer/Footer";

function Landing({ setShowLogin }) {

    return(

        <div className="landing">

            <Navbar />

            <Hero
                onStart={() => setShowLogin(true)}
            />

            <Features />

            <Footer />

        </div>

        

    );

}

export default Landing;