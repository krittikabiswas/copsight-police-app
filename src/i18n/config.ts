import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
import en from './locales/en.json';
import od from './locales/od.json';
import bn from './locales/bn.json';
import hi from './locales/hi.json';

// Create empty resources for extended languages
// This allows i18next to recognize them and trigger re-renders
const emptyTranslation = {};

const resources = {
    // Core languages with full JSON translations
    en: { translation: en },
    od: { translation: od },
    bn: { translation: bn },
    hi: { translation: hi },
    // Extended languages (will use LibreTranslate API)
    ta: { translation: emptyTranslation }, // Tamil
    te: { translation: emptyTranslation }, // Telugu
    mr: { translation: emptyTranslation }, // Marathi
    gu: { translation: emptyTranslation }, // Gujarati
    kn: { translation: emptyTranslation }, // Kannada
    ml: { translation: emptyTranslation }, // Malayalam
    pa: { translation: emptyTranslation }, // Punjabi
    ur: { translation: emptyTranslation }, // Urdu
    as: { translation: emptyTranslation }, // Assamese
    es: { translation: emptyTranslation }, // Spanish
    fr: { translation: emptyTranslation }, // French
    de: { translation: emptyTranslation }, // German
    zh: { translation: emptyTranslation }, // Chinese
    ja: { translation: emptyTranslation }, // Japanese
    ko: { translation: emptyTranslation }, // Korean
    ar: { translation: emptyTranslation }, // Arabic
    ru: { translation: emptyTranslation }, // Russian
    pt: { translation: emptyTranslation }, // Portuguese
    it: { translation: emptyTranslation }, // Italian
};

// Initialize i18n synchronously
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        react: {
            useSuspense: false, // Disable Suspense to avoid race conditions
        },
        // Don't save missing keys
        saveMissing: false,
        // Return the key itself when translation is missing
        returnEmptyString: false,
        returnNull: false,
    });

export default i18n;
