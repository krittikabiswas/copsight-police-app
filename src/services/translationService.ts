// Translation Service - Using MyMemory Translation API
// MyMemory is FREE (up to 1000 words/day) and CORS-friendly (works in browsers)!
// No API key needed for basic usage

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
  };
  responseStatus: number;
}

class TranslationService {
  private cache: TranslationCache = {};
  private readonly CACHE_KEY = 'copsite_translation_cache';
  // MyMemory Translation API - FREE and CORS-friendly!
  private readonly API_ENDPOINT = 'https://api.mymemory.translated.net/get';

  constructor() {
    this.loadCache();
  }

  // Load cached translations from localStorage
  private loadCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        this.cache = JSON.parse(cached);
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }

  // Save cache to localStorage
  private saveCache(): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  // Get cached translation
  private getCached(text: string, targetLang: string): string | null {
    return this.cache[text]?.[targetLang] || null;
  }

  // Set cached translation
  private setCached(text: string, targetLang: string, translation: string): void {
    if (!this.cache[text]) {
      this.cache[text] = {};
    }
    this.cache[text][targetLang] = translation;
    this.saveCache();
  }

  // Translate text using MyMemory API (GET request, CORS-friendly)
  async translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
    // Return original text if same language
    if (targetLang === sourceLang) {
      return text;
    }

    // Check cache first
    const cached = this.getCached(text, targetLang);
    if (cached) {
      return cached;
    }

    try {
      // MyMemory uses GET with query parameters - CORS friendly!
      const url = new URL(this.API_ENDPOINT);
      url.searchParams.append('q', text);
      url.searchParams.append('langpair', `${this.mapLanguageCode(sourceLang)}|${this.mapLanguageCode(targetLang)}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data: MyMemoryResponse = await response.json();
      
      if (data.responseStatus !== 200) {
        throw new Error(`Translation failed: ${data.responseStatus}`);
      }

      const translatedText = data.responseData.translatedText;

      // Cache the result
      this.setCached(text, targetLang, translatedText);

      return translatedText;
    } catch (error) {
      console.error('❌ [MyMemory API Error]', error);
      return text; // Return original text on error
    }
  }

  // Map language codes to MyMemory format
  private mapLanguageCode(code: string): string {
    const mapping: { [key: string]: string } = {
      'od': 'or', // Odia
      'zh': 'zh-CN', // Chinese (simplified)
      'he': 'he', // Hebrew
      'ta': 'ta', // Tamil
      'te': 'te', // Telugu
      'mr': 'mr', // Marathi
      'gu': 'gu', // Gujarati
      'kn': 'kn', // Kannada
      'ml': 'ml', // Malayalam
      'pa': 'pa', // Punjabi
      'ur': 'ur', // Urdu
      'as': 'as', // Assamese
    };
    return mapping[code] || code;
  }

  // Clear translation cache
  clearCache(): void {
    this.cache = {};
    localStorage.removeItem(this.CACHE_KEY);
  }

  // Get cache statistics
  getCacheStats(): { totalEntries: number; totalLanguages: number } {
    const entries = Object.keys(this.cache).length;
    const languages = new Set<string>();
    Object.values(this.cache).forEach((langs) => {
      Object.keys(langs).forEach((lang) => languages.add(lang));
    });
    return {
      totalEntries: entries,
      totalLanguages: languages.size,
    };
  }
}

// Export singleton instance
export const translationService = new TranslationService();
