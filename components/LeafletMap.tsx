"use client";

import { cn } from "@/lib/utils";

export type LeafletMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  markerLabel?: string;
  className?: string;
};

export const LeafletMap = ({
  lat,
  lng,
  zoom = 14,
  markerLabel = "Atelier LBF — Moncoutant",
  className,
}: LeafletMapProps) => {
  const query = encodeURIComponent(`${markerLabel} @${lat},${lng}`);
  const src = `https://www.google.com/maps?q=${query}&ll=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div className={cn("overflow-hidden border border-slate-200", className)}>
      <iframe
        src={src}
        title={markerLabel}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
        style={{ border: 0, minHeight: 260 }}
        allowFullScreen
      />
    </div>
  );
};
