import "./Footer.css";

import { useTranslation } from "react-i18next";


function Footer() {

    const { t } = useTranslation();


    return (

        <footer className="footer">

            <div className="footerBrand">

                <img
                    src="/favicon.png"
                    alt="DysLearn"
                    className="footerLogo"
                />

                <h2>
                    DysLearn
                </h2>

            </div>


            <p className="footerTagline">

                {t("footer.tagline")}

            </p>


            <p className="footerCopyright">

                {t("footer.copyright")}

            </p>

        </footer>

    );

}


export default Footer;