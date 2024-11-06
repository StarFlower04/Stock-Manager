import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ua from './ua';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ua: ua,
    },
    lng: "en", // Мова за замовчуванням
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React вже захищає від XSS
    },
  });

export default i18n;