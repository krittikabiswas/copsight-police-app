/**
 * Hybrid Translation Hook
 * Provides translation functionality with fallback support
 * Can be extended with i18n library in the future
 */

interface TranslationDict {
  [key: string]: string | TranslationDict;
}

// Default translation dictionary
const defaultTranslations: TranslationDict = {
  nav: {
    home: "Home",
    about: "About",
    register: "Register",
  },
  footer: {
    brand: "Copsight",
    tagline: "Secure law enforcement data analytics platform",
    quickLinks: "Quick Links",
    legal: "Legal",
    contact: "Contact",
    email: "contact@copsight.gov.in",
    phone: "+91 1800-XXXXXX",
    address: "India",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
    accessibility: "Accessibility",
    copyright: "Copsight. All rights reserved.",
    developedBy: "Developed by",
    team: "Copsight Team",
    secured: "Secured & Encrypted",
  },
};

/**
 * Get nested translation value from dictionary
 */
const getTranslation = (key: string, dict: TranslationDict): string => {
  const keys = key.split(".");
  let current: any = dict;

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return key; // Return key as fallback
    }
  }

  return typeof current === "string" ? current : key;
};

/**
 * Hook for translation with hybrid approach
 * Currently uses default translations, can be extended with i18n
 */
export const useHybridTranslation = () => {
  const t = (key: string, replacements?: Record<string, string>): string => {
    let translation = getTranslation(key, defaultTranslations);

    // Apply replacements if provided
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{{${placeholder}}}`, value);
      });
    }

    return translation;
  };

  return { t };
};
