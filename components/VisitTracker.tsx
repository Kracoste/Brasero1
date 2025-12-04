'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function VisitTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Créer un ID unique pour ce visiteur (stocké en localStorage)
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('visitor_id', visitorId);
        }

        // Enregistrer la visite
        await supabase.from('visits').insert({
          visitor_id: visitorId,
          page: pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        // Silently fail - ne pas bloquer l'expérience utilisateur
        console.debug('Visit tracking failed:', error);
      }
    };

    trackVisit();
  }, [pathname, supabase]);

  return null;
}
