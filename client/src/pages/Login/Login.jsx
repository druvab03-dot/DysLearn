import "./Login.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AuthCard from "../../components/AuthCard/AuthCard";


function Login() {

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