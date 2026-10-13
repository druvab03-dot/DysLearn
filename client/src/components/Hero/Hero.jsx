import "./Hero.css";

import { useTranslation } from "react-i18next";


function Hero({ onStart }) {

    const { t } =
        useTranslation();


    return (

        <section className="hero">

            <h1>

                {t("landing.heroTitleLine1")}

                <br />

                {t("landing.heroTitleLine2")}

            </h1>

            <p>
                {t("landing.heroDescription")}
            </p>

            <button
                className="heroButton"
                onClick={onStart}
            >
                {t("landing.startLearning")}
            </button>

        </section>

    );

}


export default Hero;