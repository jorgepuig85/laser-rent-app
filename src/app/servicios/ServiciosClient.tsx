"use client";

import { useState } from "react";
import Image from "next/image";

type Item = { id: string; name: string; price: number };

const formatImageName = (name: string) => {
  const isHombre = name.toLowerCase().startsWith("hombre");
  const cleanName = name.replace(/^(Mujer - |Hombre - )/i, '').trim();
  const key = cleanName.toLowerCase();
  
  if (isHombre) {
    const mappingsHombre: Record<string, string> = {
      "axilas": "axilas_masculino.jpg",
      "brazos": "brazos_masculino.jpg",
      "espalda completa": "espalda_completa_masculino.jpg",
      "pecho y abdomen": "pecho_abdomen_masculino.jpg",
      "piernas completas": "piernas_completas_masculino.jpg",
      "rostro": "rostro_masculino.jpg",
      "zona pelvica": "zona_pelvica_masculino.jpg",
      "zona pélvica": "zona_pelvica_masculino.jpg",
    };
    if (mappingsHombre[key]) return mappingsHombre[key];
  } else {
    // Mapeo específico dictado para resolver mayúsculas y formatos exactos
    const mappingsMujer: Record<string, string> = {
      "axilas": "Axilas_mujer.png",
      "rostro": "Rostro_mujer.png",
      "cavado completo": "cavado_completo_mujer.jpg",
      "brazos": "brazos_mujer.png",
      "gluteos": "gluteos_mujer.png",
      "glúteos": "gluteos_mujer.png",
      "piernas completas": "piernas_completas_mujer.png",
      "abdomen": "Abdomen_mujer.png",
      "cavado bikini": "cavado_bikini_mujer.png",
      "media pierna": "Media_pierna_mujer.jpg",
      "bozo": "bozo_mujer.png",
    };
    if (mappingsMujer[key]) return mappingsMujer[key];
  }
  
  // Fallback genérico para cualquier otro servicio no mapeado (siempre asume mujer png por defecto para evitar roturas)
  const formatted = cleanName.toLowerCase().replace(/\s+/g, '_');
  return `${formatted}_mujer.png`;
};

export function ServiciosClient({ items }: { items: Item[] }) {
  const [activeTab, setActiveTab] = useState<"mujer" | "hombre">("mujer");

  const filteredItems = items.filter(item => {
    const isMujer = item.name.toLowerCase().startsWith("mujer");
    const isHombre = item.name.toLowerCase().startsWith("hombre");
    
    if (activeTab === "mujer" && isMujer) return true;
    if (activeTab === "hombre" && isHombre) return true;
    return false;
  });

  return (
    <div className="space-y-12 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab("mujer")}
          className={`px-8 py-3.5 sm:py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
            activeTab === "mujer" 
              ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30" 
              : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
          }`}
        >
          Mujer
        </button>
        <button
          onClick={() => setActiveTab("hombre")}
          className={`px-8 py-3.5 sm:py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
            activeTab === "hombre" 
              ? "bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30" 
              : "bg-white border border-stone-200 text-stone-500 hover:bg-stone-50"
          }`}
        >
          Hombre
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const cleanName = item.name.replace(/^(Mujer - |Hombre - )/i, '').trim();
          const imageName = formatImageName(item.name);
          const imageUrl = `https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/web/${imageName}`;

          return (
            <div 
              key={item.id} 
              className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Uso de bg-stone-200 como placeholder sólido (CLS Optimization) */}
              <div className="relative aspect-[4/5] w-full bg-stone-200 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`Tratamiento de ${cleanName}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  priority={index < 4 || cleanName.toLowerCase() === 'axilas' || cleanName.toLowerCase() === 'rostro'}
                />
                {/* Gradiente sutil para legibilidad del texto sobre cualquier imagen */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-90" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2 shadow-black/50 drop-shadow-md leading-tight">
                  {cleanName}
                </h3>
                <p className="text-[#D4AF37] font-bold text-xl drop-shadow-md flex items-center gap-1">
                  <span className="text-sm font-medium text-[#D4AF37]/80">$</span>
                  {Number(item.price).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone-400">No se encontraron servicios para esta categoría.</p>
        </div>
      )}
    </div>
  );
}
