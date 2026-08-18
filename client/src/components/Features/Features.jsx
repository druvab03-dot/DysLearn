import "./Features.css";

import { useTranslation } from "react-i18next";


function Features() {

    const { t } = useTranslation();


    const features = [

        {
            title: t("landing.handwritingTitle"),
            description: t("landing.handwritingDescription")
        },

        {
            title: t("landing.multilingualTitle"),
            description: t("landing.multilingualDescription")
        },

        {
            title: t("landing.parentDashboardTitle"),
            description: t("landing.parentDashboardDescription")
        },

        {
            title: t("landing.interactiveTitle"),
            description: t("landing.interactiveDescription")
        }

    ];


    return (

        <section className="features">

            <h2>
                {t("landing.featuresTitle")}
            </h2>


            <div className="featureGrid">

                {features.map((feature, index) => (

                    <div
                        className="featureCard"
                        key={index}
                    >

                        <h3>
                            {feature.title}
                        </h3>

                        <p>
                            {feature.description}
                        </p>

                    </div>

                ))}

            </div>

        </section>

    );

}


export default Features;