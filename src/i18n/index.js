import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectLanguage } from './detector.js';
import zh from './locales/zh.json';
import en from './locales/en.json';

i18next.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18next;
