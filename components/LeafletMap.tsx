'use client';

import dynamic from "next/dynamic";

import type { LeafletMapProps } from "@/components/LeafletMapClient";

const LeafletMapInner = dynamic(() => import("@/components/LeafletMapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] w-full items-center justify-center rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400">
      Chargement de la carte…
    </div>
  ),
});

export const LeafletMap = (props: LeafletMapProps) => <LeafletMapInner {...props} />;
