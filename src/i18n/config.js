import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'en',
    resources: {
        en: {
            translations: require('./locales/en/translations.json')
        },
        af: {
            translations: require('./locales/af/translations.json')
        },
        de: {
            translations: require('./locales/de/translations.json')
        },
        es: {
            translations: require('./locales/es/translations.json')
        },
        fr: {
            translations: require('./locales/fr/translations.json')
        },
        nl: {
            translations: require('./locales/nl/translations.json')
        },
        'zh-CN': {
            translations: require('./locales/zh-CN/translations.json')
        },
        'zh-TW': {
            translations: require('./locales/zh-TW/translations.json')
        }
    },
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
        escapeValue: false
    }
});

i18n.languages = ['en', 'af', 'de', 'es', 'fr', 'nl', 'zh-CN', 'zh-TW'];

export default i18n;
