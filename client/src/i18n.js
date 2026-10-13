import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import kn from "./locales/kn.json";
import hi from "./locales/hi.json";


const savedLanguage =
    localStorage.getItem("language") || "en";


i18n
    .use(initReactI18next)
    .init({

        resources: {

            en: {
                translation: en
            },

            kn: {
                translation: kn
            },

            hi: {
                translation: hi
            }

        },

        lng: savedLanguage,

        fallbackLng: "en",

        supportedLngs: [
            "en",
            "kn",
            "hi"
        ],

        load: "languageOnly",

        interpolation: {
            escapeValue: false
        }

    });


i18n.on(
    "languageChanged",
    (language) => {

        localStorage.setItem(
            "language",
            language
        );

    }
);


export default i18n;