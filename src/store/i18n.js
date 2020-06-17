import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// eslint-disable-next-line import/no-webpack-loader-syntax
import resources from '!@alienfast/i18next-loader?{"basenameAsNamespace":"true", "include": ["**/*.json"]}!../localization/engineering_reports_localization/index.js'
// import resources from '../localization/engineering_reports_localization'

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        resources,
    });

export default i18n