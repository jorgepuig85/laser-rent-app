"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";

// Fix missing marker icons in leaflet with nextjs
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Location {
  id?: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapProps {
  locations: Location[];
}

export default function Map({ locations }: MapProps) {
  // Center roughly in La Pampa (Santa Rosa)
  const center: [number, number] = [-36.6167, -64.2833];

  return (
    <MapContainer center={center} zoom={7} className="w-full h-[600px] rounded-[2rem] shadow-lg border border-slate-200 z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id || loc.name} position={[loc.lat, loc.lng]} icon={icon}>
          <Popup className="rounded-xl border-none shadow-xl min-w-[180px]">
            <div className="flex flex-col gap-3 p-1">
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-none">{loc.name}</h3>
                <p className="text-xs text-green-600 font-semibold mt-1">Cobertura Activa</p>
              </div>
              <a 
                href={`https://wa.me/5492954631456?text=${encodeURIComponent(`Hola! Quiero solicitar un equipo para la localidad de ${loc.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="w-full font-bold">
                  Solicitar envío aquí
                </Button>
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
