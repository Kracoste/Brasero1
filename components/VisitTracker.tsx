'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Créer un ID unique pour ce visiteur (stocké en localStorage)
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("visitor_id", visitorId);
        }

        // Enregistrer la visite
        const response = await fetch("/api/visits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            page: pathname || window.location.pathname,
            referrer: document.referrer || null,
          }),
        });

        if (!response.ok) {
          const details = await response.json().catch(() => undefined);
          console.debug("Visit API error", details);
        }
      } catch (error) {
        // Silently fail - ne pas bloquer l'expérience utilisateur
        console.debug("Visit tracking failed:", error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
