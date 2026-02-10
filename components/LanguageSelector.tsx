'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');

  // Detect current language from cookies or Google Translate
  const detectCurrentLanguage = useCallback(() => {
    // Check googtrans cookie
    const match = document.cookie.match(/googtrans=\/fr\/([a-z]{2})/);
    if (match && match[1]) {
      const langCode = match[1];
      if (languages.some(l => l.code === langCode)) {
        setCurrentLang(langCode);
        return;
      }
    }

    // Check Google Translate select element
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl && selectEl.value && selectEl.value !== '') {
      if (languages.some(l => l.code === selectEl.value)) {
        setCurrentLang(selectEl.value);
        return;
      }
    }

    // Default to French
    setCurrentLang('fr');
  }, []);

  useEffect(() => {
    // Wait for Google Translate to be ready
    const checkReady = setInterval(() => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        detectCurrentLanguage();
        clearInterval(checkReady);
      }
    }, 500);

    // Detect language changes via MutationObserver
    const observer = new MutationObserver(() => {
      detectCurrentLanguage();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'lang'],
    });

    // Also detect from body
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: false,
      });
    }

    // Initial detection
    detectCurrentLanguage();

    return () => {
      clearInterval(checkReady);
      observer.disconnect();
    };
  }, [detectCurrentLanguage]);

  const clearGoogTransCookies = () => {
    const hostname = window.location.hostname;
    const domains = ['', hostname, `.${hostname}`];
    
    domains.forEach(domain => {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainPart}`;
    });
  };

  const setGoogTransCookie = (langCode: string) => {
    const hostname = window.location.hostname;
    const cookieValue = `/fr/${langCode}`;
    const domains = ['', hostname, `.${hostname}`];
    
    domains.forEach(domain => {
      const domainPart = domain ? `; domain=${domain}` : '';
      document.cookie = `googtrans=${cookieValue}; path=/${domainPart}`;
    });
  };

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);
    
    if (langCode === currentLang) return;

    // Vérifier que Google Translate est prêt
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (!selectEl) {
      console.warn('[LanguageSelector] Google Translate not ready');
      return;
    }

    // Méthode 1 : Utiliser directement le select de Google Translate
    selectEl.value = langCode;
    
    // Déclencher l'événement change pour que Google Translate réagisse
    const event = new Event('change', { bubbles: true });
    selectEl.dispatchEvent(event);
    
    // Méthode 2 : Forcer les cookies en parallèle pour la persistance
    clearGoogTransCookies();
    if (langCode !== 'fr') {
      setGoogTransCookie(langCode);
    }
    
    // Mettre à jour l'état local immédiatement
    setCurrentLang(langCode);
    
    // NE PAS RELOAD - laisser Google Translate gérer la transformation
    // La page se rechargera naturellement quand Google Translate aura fini
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative notranslate">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
        aria-label="Changer de langue"
      >
        <span className="text-base sm:text-lg">{currentLanguage.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden notranslate">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left ${
                    currentLang === lang.code ? 'bg-[#CD853F]/10 font-medium text-[#8B4513]' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
