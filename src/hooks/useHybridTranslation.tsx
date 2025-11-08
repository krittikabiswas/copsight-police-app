// Custom hook for hybrid translation (JSON + LibreTranslate API)
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback, useRef } from 'react';
import { translationService } from '../services/translationService';
import { isCoreLanguage } from '../i18n/languages';

// Global cache for translations to share across components
const globalTranslationCache = new Map<string, string>();

export function useHybridTranslation() {
  const { t: i18nextT, i18n } = useTranslation();
  const [, forceUpdate] = useState({});
  const currentLang = i18n.language;
  const isCore = isCoreLanguage(currentLang);
  const translatingKeys = useRef(new Set<string>());

  // Force re-render when language changes
  useEffect(() => {
    console.log(`🌍 [Language] Changed to: ${currentLang} ${isCore ? '(Core)' : '(Extended - API)'}`);
    // Clear the translating keys set when language changes
    translatingKeys.current.clear();
    // Force component re-render on language change
    forceUpdate({});
  }, [currentLang, isCore]);

  // Enhanced t function that auto-translates for extended languages
  const t = useCallback((key: string, fallbackText?: string): string => {
    // For core languages, use i18next directly
    if (isCore) {
      return i18nextT(key);
    }

    // For extended languages:
    // 1. Try i18next first (might have the translation in JSON)
    const i18nextResult = i18nextT(key);
    if (i18nextResult !== key) {
      return i18nextResult;
    }

    // 2. Check global cache
    const cacheKey = `${currentLang}:${key}`;
    if (globalTranslationCache.has(cacheKey)) {
      const cached = globalTranslationCache.get(cacheKey)!;
      console.log(`✅ [Cache] ${key} -> ${cached}`);
      return cached;
    }

    // 3. Get English text (fallback or from en.json)
    const englishText = fallbackText || i18nextT(key, { lng: 'en' });
    
    // If we got the key back from English too, just return it
    if (englishText === key && !fallbackText) {
      return key;
    }

    // 4. Trigger async translation if not already in progress
    if (!translatingKeys.current.has(cacheKey)) {
      translatingKeys.current.add(cacheKey);
      
      console.log(`🌐 [API Call] Translating "${englishText}" to ${currentLang}`);
      
      translationService.translateText(englishText, currentLang, 'en')
        .then(translated => {
          console.log(`✅ [Translated] "${englishText}" -> "${translated}"`);
          globalTranslationCache.set(cacheKey, translated);
          translatingKeys.current.delete(cacheKey);
          // Force re-render to show translated text
          forceUpdate({});
        })
        .catch(error => {
          console.error('❌ [Translation Error]', key, error);
          translatingKeys.current.delete(cacheKey);
        });
    }

    // Return English text while translation is in progress
    return englishText;
  }, [i18nextT, currentLang, isCore]);

  // Helper to check if translation exists in JSON
  const hasTranslation = (key: string): boolean => {
    const translation = i18nextT(key);
    return translation !== key;
  };

  // Translate text using hybrid approach (kept for compatibility)
  const translate = async (key: string, fallbackText?: string): Promise<string> => {
    const cacheKey = `${currentLang}:${key}`;
    
    // Check cache
    if (globalTranslationCache.has(cacheKey)) {
      return globalTranslationCache.get(cacheKey)!;
    }

    // For core languages
    if (isCore) {
      return i18nextT(key);
    }

    // Try i18next first
    const i18nextResult = i18nextT(key);
    if (i18nextResult !== key) {
      return i18nextResult;
    }

    // Use LibreTranslate
    const textToTranslate = fallbackText || i18nextT(key, { lng: 'en' });
    if (textToTranslate === key && !fallbackText) {
      return key;
    }

    const translated = await translationService.translateText(
      textToTranslate,
      currentLang,
      'en'
    );
    
    globalTranslationCache.set(cacheKey, translated);
    return translated;
  };

  // Translate multiple texts in batch
  const translateBatch = async (items: Array<{ key: string; fallback?: string }>): Promise<string[]> => {
    if (isCore) {
      return items.map(item => i18nextT(item.key));
    }

    const results = await Promise.all(
      items.map(item => translate(item.key, item.fallback))
    );

    return results;
  };

  return {
    t, // Enhanced translation function with auto-translation
    translate, // Async translation
    translateBatch,
    hasTranslation,
    isTranslating: translatingKeys.current.size > 0,
    currentLanguage: currentLang,
    isExtendedLanguage: !isCore,
    changeLanguage: i18n.changeLanguage,
  };
}

// React component for dynamic content translation
interface DynamicTranslateProps {
  text: string;
  translationKey?: string;
  className?: string;
}

export function DynamicTranslate({ text, translationKey, className }: DynamicTranslateProps) {
  const { translate, currentLanguage } = useHybridTranslation();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const performTranslation = async () => {
      const result = await translate(translationKey || text, text);
      setTranslatedText(result);
    };

    performTranslation();
  }, [text, translationKey, currentLanguage, translate]);

  return <span className={className}>{translatedText}</span>;
}
