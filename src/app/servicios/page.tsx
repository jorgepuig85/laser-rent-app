import { createClient } from "@/lib/supabaseServer";
import { ServiciosClient } from "./ServiciosClient";
import { Sparkles } from "lucide-react";

export const revalidate = 60; // Cacheo para performance, revalida cada minuto

export default async function ServiciosPage() {
  const supabase = await createClient();

  // Fetch only non-combo items
  const { data: items } = await supabase
    .from("items")
    .select("id, name, price, is_combo")
    .eq("is_combo", false)
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#B89B72] uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Tratamientos
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            Nuestros Servicios
          </h1>
          <p className="mt-4 text-stone-500 max-w-2xl mx-auto text-lg">
            Tecnología Soprano Ice para resultados definitivos desde la primera sesión. Seleccioná tu tratamiento para conocer el valor.
          </p>
        </div>
        
        <ServiciosClient items={items || []} />
      </div>
    </div>
  );
}
