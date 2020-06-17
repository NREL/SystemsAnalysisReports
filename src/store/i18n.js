import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
// eslint-disable-next-line import/no-webpack-loader-syntax
import resources from '!@alienfast/i18next-loader?{"basenameAsNamespace":"true", "include": ["**/*.json"]}!../localization/engineering_reports_localization/index.js'
// import resources from '../localization/engineering_reports_localization'

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        resources,
        saveMissing: true,
        react: {
            useSuspense: false
        },
        backend: {
            addPath: '/src/localization/engineering_reports_localization/{{lng}}/{{ns}}.missing.json'
        },
        debug: true
    });

export default i18n