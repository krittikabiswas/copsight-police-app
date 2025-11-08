// Custom i18next backend that uses LibreTranslate for missing translations
import { translationService } from '../services/translationService';

// Cache for in-flight translation requests to avoid duplicates
const pendingTranslations = new Map<string, Promise<string>>();

export class LibreTranslateBackend {
  type = 'backend' as const;
  static type = 'backend' as const;

  init(services: any, backendOptions: any, i18nextOptions: any) {
    // Initialization
  }

  read(language: string, namespace: string, callback: (err: any, data: any) => void) {
    // This is called by i18next when loading translations
    // For extended languages, we return an empty object since we translate on-demand
    callback(null, {});
  }

  // Custom method to translate a missing key
  async translateMissing(key: string, targetLang: string, defaultValue: string): Promise<string> {
    // Don't translate if it's English or a core language with JSON
    const coreLanguages = ['en', 'hi', 'od', 'bn'];
    if (coreLanguages.includes(targetLang)) {
      return defaultValue;
    }

    // Create a unique cache key
    const cacheKey = `${targetLang}:${key}:${defaultValue}`;
    
    // Check if translation is already in flight
    if (pendingTranslations.has(cacheKey)) {
      return pendingTranslations.get(cacheKey)!;
    }

    // Start translation
    const translationPromise = translationService.translateText(defaultValue, targetLang, 'en');
    pendingTranslations.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      return result;
    } finally {
      // Clean up after a short delay
      setTimeout(() => pendingTranslations.delete(cacheKey), 1000);
    }
  }
}

export default LibreTranslateBackend;
