"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-[2rem] bg-slate-50 border border-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400">
      <MapPin className="h-10 w-10 mb-4 opacity-50" />
      <p>Cargando mapa interactivo...</p>
    </div>
  )
});

interface Location {
  id?: string;
  name: string;
  lat: number;
  lng: number;
}

export function MapWrapper({ locations }: { locations: Location[] }) {
  return <Map locations={locations} />;
}
