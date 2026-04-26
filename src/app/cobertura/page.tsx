import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import { MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { MapWrapper } from "@/components/MapWrapper";

export const metadata = {
  title: "Zonas de Atención | Centro de Belleza",
  description: "Conocé nuestras zonas de cobertura logística en La Pampa y Oeste de Buenos Aires. Envíos de equipos de depilación láser Soprano y ADSS."
};

// Revalidate every minute to capture new active locations
export const revalidate = 60;

export default async function CoberturaPage() {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, name, lat, lng')
    .eq('is_active', true)
    .not('lat', 'is', null)
    .order('name');

  if (error) {
    console.error("Error fetching locations:", error);
  }

  const validLocations = locations || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-16 md:py-24 animate-in fade-in duration-700 bg-white">
      <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-24 px-2">
        <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-2">
          <Truck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight text-slate-900">
          Zonas de Atención
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
          Logística propia garantizada para asegurar que tu equipo llegue a tiempo, calibrado y listo para trabajar.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-2 relative z-0 rounded-2xl overflow-hidden">
          <MapWrapper locations={validLocations} />
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 md:p-8 h-full shadow-xl shadow-slate-200/20 flex flex-col w-full overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3">
            <MapPin className="text-primary h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
            Nuestra Red
          </h2>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4 mb-8 flex-1">
            {validLocations.map((loc) => (
              <li key={loc.id || loc.name} className="flex items-start text-sm sm:text-base text-slate-700 font-medium">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 mr-3 mt-1.5 shadow-sm shadow-green-500/50 shrink-0"></div>
                <span className="flex-1 break-words leading-tight">{loc.name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 sm:pt-8 border-t border-slate-200/60">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">¿No ves tu localidad?</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 leading-relaxed">
              Consultanos. Ampliamos nuestra logística constantemente para cubrir nuevas demandas en la región.
            </p>
            <Link href="https://wa.me/5492954631456" target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full font-bold h-12 sm:h-14 rounded-xl text-sm sm:text-md transition-transform hover:scale-[1.02] shadow-lg shadow-primary/20">
                Consultar viabilidad
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
