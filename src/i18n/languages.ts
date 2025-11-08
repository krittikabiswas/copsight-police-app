// Supported languages for CopSite
// Core languages have full JSON translations
// Extended languages use Google Translate API

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isCore: boolean; // Has complete JSON translations
}

export const languages: Language[] = [
  // Core languages with full JSON translations
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isCore: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isCore: true },
  { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', isCore: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', isCore: true },

  // Additional Indian languages (API-powered)
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isCore: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isCore: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isCore: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isCore: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isCore: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isCore: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', isCore: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', isCore: false },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', isCore: false },

  // International languages (API-powered)
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isCore: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isCore: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isCore: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isCore: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isCore: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isCore: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isCore: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isCore: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isCore: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isCore: false },
];

export const coreLanguages = languages.filter(lang => lang.isCore);
export const extendedLanguages = languages.filter(lang => !lang.isCore);

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const isCoreLanguage = (code: string): boolean => {
  const lang = getLanguageByCode(code);
  return lang?.isCore || false;
};
