// Enhanced translation hook that automatically uses LibreTranslate for extended languages
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { translationService } from '../services/translationService';
import { isCoreLanguage } from '../i18n/languages';

export function useAutoTranslation() {
  const { t: originalT, i18n } = useTranslation();
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());
  const currentLang = i18n.language;
  const isCore = isCoreLanguage(currentLang);

  // Enhanced translation function
  const t = useCallback((key: string, defaultValue?: string): string => {
    // For core languages, use regular i18next
    if (isCore) {
      return originalT(key);
    }

    // For extended languages, check if we have a translation in JSON first
    const jsonTranslation = originalT(key);
    
    // If i18next returned something other than the key, use it
    if (jsonTranslation !== key) {
      return jsonTranslation;
    }

    // Otherwise, return the key itself for now (will be translated async)
    // Use default value if provided, otherwise use the key
    return defaultValue || key;
  }, [originalT, isCore]);

  // Async translation function for extended languages
  const translateAsync = useCallback(async (key: string, defaultValue?: string): Promise<string> => {
    if (isCore) {
      return originalT(key);
    }

    const cacheKey = `${currentLang}:${key}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Try JSON first
    const jsonTranslation = originalT(key);
    if (jsonTranslation !== key) {
      return jsonTranslation;
    }

    // Use LibreTranslate
    const textToTranslate = defaultValue || key;
    try {
      const translated = await translationService.translateText(
        textToTranslate,
        currentLang,
        'en'
      );
      
      // Cache the result
      setTranslationCache(prev => new Map(prev).set(cacheKey, translated));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return textToTranslate;
    }
  }, [currentLang, isCore, originalT, translationCache]);

  return {
    t,
    translateAsync,
    currentLanguage: currentLang,
    isExtendedLanguage: !isCore,
    changeLanguage: i18n.changeLanguage,
  };
}

// Component that auto-translates text for extended languages
interface AutoTranslateProps {
  children: string;
  translationKey?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function AutoTranslate({ children, translationKey, className, as: Component = 'span' }: AutoTranslateProps) {
  const { translateAsync, currentLanguage, isExtendedLanguage } = useAutoTranslation();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (!isExtendedLanguage) {
      setTranslatedText(children);
      return;
    }

    const translate = async () => {
      const result = await translateAsync(translationKey || children, children);
      setTranslatedText(result);
    };

    translate();
  }, [children, translationKey, currentLanguage, isExtendedLanguage, translateAsync]);

  return <Component className={className}>{translatedText}</Component>;
}
