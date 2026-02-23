'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

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

  const detectCurrentLanguage = useCallback(() => {
    const match = document.cookie.match(/googtrans=\/fr\/([a-z]{2})/);
    if (match?.[1] && languages.some((l) => l.code === match[1])) {
      setCurrentLang(match[1]);
      return;
    }
    const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (sel?.value && languages.some((l) => l.code === sel.value)) {
      setCurrentLang(sel.value);
      return;
    }
    setCurrentLang('fr');
  }, []);

  useEffect(() => {
    // Wait for GT combo to be ready, then detect
    const id = setInterval(() => {
      const sel = document.querySelector('.goog-te-combo');
      if (sel) { detectCurrentLanguage(); clearInterval(id); }
    }, 500);
    // Also detect immediately from cookie
    detectCurrentLanguage();

    const obs = new MutationObserver(detectCurrentLanguage);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'lang'] });

    return () => { clearInterval(id); obs.disconnect(); };
  }, [detectCurrentLanguage]);

  const clearCookies = () => {
    const h = window.location.hostname;
    // Build list of all possible cookie domains
    // e.g. for www.atelier-lbf.fr → ['', 'www.atelier-lbf.fr', '.www.atelier-lbf.fr', '.atelier-lbf.fr', 'atelier-lbf.fr']
    const domains = ['', h, '.' + h];
    const parts = h.split('.');
    if (parts.length > 2) {
      const rootDomain = parts.slice(1).join('.');
      domains.push(rootDomain, '.' + rootDomain);
    }
    domains.forEach((d) => {
      const dp = d ? '; domain=' + d : '';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + dp;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax' + dp;
    });
  };

  const setCookie = (lang: string) => {
    const h = window.location.hostname;
    const v = '/fr/' + lang;
    ['', h, '.' + h].forEach((d) => {
      const dp = d ? '; domain=' + d : '';
      document.cookie = 'googtrans=' + v + '; path=/' + dp;
    });
  };

  const changeLanguage = (langCode: string) => {
    setIsOpen(false);
    if (langCode === currentLang) return;

    if (langCode === 'fr') {
      clearCookies();
      setCurrentLang('fr');
      // Also tell GT to switch back to original language
      const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (sel) {
        sel.value = 'fr';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Small delay to let GT process the change, then reload
      setTimeout(() => window.location.reload(), 100);
      return;
    }

    // Try in-place change via GT select
    const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (sel) {
      sel.value = langCode;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      clearCookies();
      setCookie(langCode);
      setCurrentLang(langCode);
      return;
    }

    // GT not ready yet — set cookie and reload
    clearCookies();
    setCookie(langCode);
    setCurrentLang(langCode);
    window.location.reload();
  };

  const cur = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative notranslate">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
        aria-label="Changer de langue"
      >
        <span className="text-base sm:text-lg">{cur.flag}</span>
        <ChevronDown className={'w-3 h-3 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden notranslate">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={'w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left ' +
                    (currentLang === lang.code ? 'bg-[#CD853F]/10 font-medium text-[#8B4513]' : '')}
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
