"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

import { cn } from "@/lib/utils";

export type LeafletMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  markerLabel?: string;
  className?: string;
};

const defaultLabel = "Atelier Brasero — Moncoutant";

const MapContent = ({ lat, lng, zoom = 13, markerLabel = defaultLabel, className }: LeafletMapProps) => (
  <div className={cn("overflow-hidden border border-slate-800", className)}>
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", minHeight: "260px" }}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
      />
      <CircleMarker center={[lat, lng]} radius={10} fillOpacity={0.9} color="#e36414" weight={3}>
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
          <span className="text-xs font-semibold text-clay-900">{markerLabel}</span>
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  </div>
);

export default MapContent;
