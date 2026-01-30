'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

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
  const [isChanging, setIsChanging] = useState(false);

  // Detect current language from Google Translate
  const detectCurrentLanguage = useCallback(() => {
    // Check cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'googtrans' && value) {
        const langCode = value.split('/').pop();
        if (langCode && languages.some(l => l.code === langCode)) {
          setCurrentLang(langCode);
          return;
        }
      }
    }

    // Check if body has translated class and get from select
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl && selectEl.value) {
      setCurrentLang(selectEl.value);
    }
  }, []);

  useEffect(() => {
    // Initialize Google Translate
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        try {
          const layoutOption = window.google.translate.TranslateElement.InlineLayout?.SIMPLE;
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'fr',
              includedLanguages: 'fr,en,de,es,nl',
              ...(layoutOption && { layout: layoutOption }),
              autoDisplay: false,
            },
            'google_translate_element'
          );
          setTimeout(detectCurrentLanguage, 500);
        } catch (e) {
          console.warn('Google Translate init error:', e);
        }
      }
    };

    // Set the callback
    window.googleTranslateElementInit = initGoogleTranslate;

    // Check if script is already loaded
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      initGoogleTranslate();
    }

    // Detect language changes
    const observer = new MutationObserver(() => {
      detectCurrentLanguage();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Periodic check
    const interval = setInterval(detectCurrentLanguage, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [detectCurrentLanguage]);

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);
    
    if (langCode === currentLang) return;
    
    // Afficher l'écran de chargement
    setIsChanging(true);
    
    // Créer un overlay de transition pour masquer le flash
    const overlay = document.createElement('div');
    overlay.id = 'language-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      transition: opacity 0.3s ease;
    `;
    
    const loader = document.createElement('div');
    loader.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #CD853F; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 16px; color: #8B4513; font-size: 14px;">Traduction en cours...</p>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    overlay.appendChild(loader);
    document.body.appendChild(overlay);
    
    setCurrentLang(langCode);
    
    // Fonction pour changer la langue via le select Google Translate
    const tryChangeWithSelect = () => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        selectEl.value = langCode;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    };

    // Supprimer l'overlay après la traduction
    const removeOverlay = () => {
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          setIsChanging(false);
        }, 300);
      }, 800); // Attendre que Google Translate ait fini
    };

    // Essayer de changer immédiatement
    if (tryChangeWithSelect()) {
      removeOverlay();
      return;
    }

    // Si le select n'est pas trouvé, réessayer quelques fois
    let attempts = 0;
    const maxAttempts = 5;
    const tryInterval = setInterval(() => {
      attempts++;
      if (tryChangeWithSelect()) {
        clearInterval(tryInterval);
        removeOverlay();
      } else if (attempts >= maxAttempts) {
        clearInterval(tryInterval);
        
        // Fallback: utiliser les cookies et recharger
        const hostname = window.location.hostname;
        
        // Effacer tous les cookies googtrans
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname}`;
        
        if (langCode !== 'fr') {
          const cookieValue = `/fr/${langCode}`;
          document.cookie = `googtrans=${cookieValue}; path=/`;
          document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname}`;
          document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname}`;
        }
        
        window.location.reload();
      }
    }, 200);
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
