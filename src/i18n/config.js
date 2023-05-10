import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'en',
    resources: {
        en: {
            translations: require('./locales/en/translations.json')
        },
        'zh-CN': {
            translations: require('./locales/zh-CN/translations.json')
        }
    },
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
        escapeValue: false
    }
});

i18n.languages = ['en', 'zh-CN'];

export default i18n;
