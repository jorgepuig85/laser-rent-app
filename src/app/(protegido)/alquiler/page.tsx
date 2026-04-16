import { createClient } from "@/lib/supabaseServer";
import { ReservationClient } from "./ReservationClient";
import { redirect } from "next/navigation";
import Image from "next/image";

const ADSS_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/equipo_depilacion.webp";

export default async function AlquilerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  // Obtener el perfil profesional asociado
  const { data: pro } = await supabase
    .from("external_professionals")
    .select("id, name")
    .eq("auth_id", user.id)
    .single();

  if (!pro) return redirect("/completar-perfil");

  // Obtener todas las reservas existentes (incluyendo mantenimiento) para inhabilitar fechas
  const { data: rentals } = await supabase
    .from("rentals")
    .select("start_date, end_date");

  // Obtener tarifa diaria
  const { data: priceData } = await supabase
    .from("rental_prices")
    .select("daily_rate")
    .eq("equipment_name", "ADSS FG2000B")
    .single();

  const dailyRate = priceData?.daily_rate || 0;

  return (
    <div className="max-w-6xl mx-auto py-24 px-4">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 mb-4">
          Agenda tu Jornada
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Selecciona un rango de fechas para bloquear tu alquiler del ADSS FG2000B. Las fechas en gris ya están ocupadas.
        </p>
      </div>
      
      <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
        <ReservationClient
          professionalId={pro.id}
          professionalName={pro.name}
          existingRentals={rentals || []}
          dailyRate={dailyRate}
        />
        
        <div className="hidden md:block relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 sticky top-24">
           <Image
            src={ADSS_IMAGE}
            alt="ADSS FG2000B"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h3 className="font-serif text-2xl font-bold">ADSS FG2000B</h3>
              <p className="text-white/80">Plataforma Trío Laser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
